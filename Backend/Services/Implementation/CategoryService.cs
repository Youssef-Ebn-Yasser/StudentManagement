namespace Backend.Services.Implementation;

public class CategoryService : ResponseHandler, ICategoryService
{
    #region   Fields
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IStringLocalizer _localizer;
    private readonly IStructuredLogger _logger;
    private readonly IGeminiObjectTranslator _translator;
    CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
    #endregion

    #region   Constructor
    public CategoryService(IUnitOfWork unitOfWork,
                           IMapper mapper,
                           IStringLocalizer stringLocalizer,
                           IStructuredLogger logger,
                           IGeminiObjectTranslator translator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _localizer = stringLocalizer;
        _logger = logger;
        _translator = translator;
    }
    #endregion

    #region   Method
    public async Task<Response<List<CategoryDto>>> GetAllAsync()
    {
        var allCategories = await _unitOfWork.Repository<Category>()
                                                          .GetTableNoTracking()
                                                          .Where(c => !c.IsDeleted)
                                                          .ToListAsync();

        if (allCategories == null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.category,
                Message = $"no category to return",
                Level = EnLevel.Warnning,
                LogsIn = "Category",
            });

            return BadRequest<List<CategoryDto>>("No Category Found");
        }
        var lang = cultureInfo.TwoLetterISOLanguageName.ToLower();

        var mapped = _mapper.Map<List<CategoryDto>>(allCategories);

        return Success(mapped);
    }
    public async Task<Response<CategoryDto>> GetByIdAsync(int id)
    {
        var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category == null || category.IsDeleted)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.category,
                Message = $"No Category with this Id = {id} found",
                Level = EnLevel.Warnning,
                LogsIn = "Category",
            });

            return NotFound<CategoryDto>("Category not found");
        }

        var lang = cultureInfo.TwoLetterISOLanguageName.ToLower();


        if (lang == "ar" && string.IsNullOrEmpty(category.CategoryNameAr))
        {
            var nameAr = await _translator.TranslateWordAsync(category.CategoryNameEn, "English", "Arabic");
            category.CategoryNameAr = nameAr;
            _unitOfWork.Complete();
        }

        var mapped = _mapper.Map<CategoryDto>(category);
        return Success(mapped);
    }
    public async Task Translate(string title, int categoryId, string language)
    {
        var category = _unitOfWork.Repository<Category>().GetTableAsTracking().FirstOrDefault(c => c.Id == categoryId);

        if (category == null) return;

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.category,
            Message = $"Start hangfire service to translate Category with id {categoryId} and name {title}",
            LogsIn = "Category",
            HappenInId = categoryId,
        });

        if (language == "en")
        {
            title = await _translator.TranslateObjectAsync<string>(title, "English", "Arabic") ?? "can not translate";

            category.CategoryNameAr = title;
        }
        else
        {
            title = await _translator.TranslateObjectAsync<string>(title, "Arabic", "English") ?? "can not translate";

            category.CategoryNameEn = title;

        }
        _unitOfWork.Repository<Category>().Update(category);
        var result = _unitOfWork.Complete();

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.category,
            Message = $"end hangfire service to translate Category with id {categoryId} and name {title} with status {result > 0}",
            LogsIn = "Category",
            HappenInId = categoryId,
        });
    }
    public async Task<Response<string>> CreateAsync(CreateCategoryDto dto)
    {
        var IsExistCategory = await _isNameExist(dto.Name);
        if (IsExistCategory)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.category,
                Message = $"Error happen When Create a Category this Category Name Exist {dto.Name}",
                LogsIn = "Category",
                Level = EnLevel.Error,
            });

            return BadRequest<string>("Student Name is already exist");
        }

        var category = _mapper.Map<Category>(dto);


        await _unitOfWork.Repository<Category>().AddAsync(category);
        var result = _unitOfWork.Complete();

        if (result < 0)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.category,
                Message = $"Error happen When Create a Category can not save in database",
                LogsIn = "Category",
                Level = EnLevel.Error,
            });

            return BadRequest<string>("Error happen when try create");
        }

        BackgroundJob.Enqueue<ICategoryService>(x =>
                        x.Translate(dto.Name, category.Id, cultureInfo.TwoLetterISOLanguageName.ToLower()));

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.category,
            Message = $"Create category done successfully with id {category.Id}",
            LogsIn = "Category",
            HappenInId = category.Id,
        });

        return Success("Category Created Successfully");
    }
    public async Task<Response<string>> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category == null)
        {
            await _logger.LogInfo(new LogInfoData()
            {
                LoghappenIn = EnLogHappenIn.category,
                Message = $"Category not found to update with this id {id}",
                LogsIn = "Category",
                Level = EnLevel.Error,
            });

            return NotFound<string>("Category not found");
        }
        _mapper.Map(dto, category);
        _unitOfWork.Repository<Category>().Update(category);
        var result = _unitOfWork.Complete();

        await _logger.LogInfo(new LogInfoData()
        {
            LoghappenIn = EnLogHappenIn.category,
            Message = $"Category updated with status {result > 0}",
            LogsIn = "Category",
            Level = EnLevel.Error,
        });

        return Success("Category updated successfully");
    }
    public async Task<Response<string>> DeleteAsync(int id)
    {
        var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category == null)
        {
            _logger.LogInfo($"Category with this id = {id} not found");
            return NotFound<string>("Category not found");
        }

        if (category.Courses != null && category.Courses.Any())
            return BadRequest<string>("Can not delete this category has an courses");

        category.IsDeleted = true;
        _unitOfWork.Complete();

        return Success("Category deleted successfully");
    }
    private async Task<bool> _isNameExist(string name)
    {
        var exist = await _unitOfWork.Repository<Student>()
                                           .GetTableNoTracking()
                                           .AnyAsync(s => s.NameEn == name && s.IsDeleted == false);

        return exist;
    }
    #endregion
}