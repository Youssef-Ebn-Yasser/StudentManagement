using Backend.DTOs.CategoryDTOOS;

namespace Backend.Services.Implementation
{
    public class CategoryService: ResponseHandler, ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork,IMapper mapper )
        {
            _unitOfWork = unitOfWork;
           _mapper = mapper;
        }
        private async Task<bool> _isNameExist(string name)
        {
            var exist = await _unitOfWork.Repository<Student>()
                                               .GetTableNoTracking()
                                               .AnyAsync(s => s.Name == name && s.IsDeleted == false);

            return exist;
        }

        public async Task<Response<string>> CreateAsync(CreateCategoryDto dto)
        {
            var IsExistCategory=await _isNameExist(dto.Name);
            if (IsExistCategory) 
                return BadRequest<string>("Student Name is already exist");
            
                var category = _mapper.Map<Category>(dto);
            await _unitOfWork.Repository<Category>().AddAsync(category);
            _unitOfWork.Complete();
            return Success("Category Created Successfully");

        }

        public async Task<Response<string>> DeleteAsync(int id)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (category == null)
                return NotFound<string>("Category not found");

            category.IsDeleted = true;
            _unitOfWork.Repository<Category>().Delete(category);
            _unitOfWork.Complete();

            return Success("Category deleted successfully");
        }

        //public async Task<Response<List<CategoryDto>>> GetAllAsync()
        //{
        //    var categories = await _unitOfWork.Repository<Category>()
        //   .FindAsync(c => !c.IsDeleted);

        //    var mapped = _mapper.Map<List<CategoryDto>>(categories);
        //    return Success(mapped);
        //}

        public async Task<Response<CategoryDto>> GetByIdAsync(int id)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (category == null || category.IsDeleted)
                return NotFound<CategoryDto>("Category not found");

            var mapped = _mapper.Map<CategoryDto>(category);
            return Success(mapped);
        }

        public async Task<Response<string>> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (category == null)
                return NotFound<string>("Category not found");

            _mapper.Map(dto, category);
            _unitOfWork.Repository<Category>().Update(category);
            _unitOfWork.Complete();

            return Success("Category updated successfully");
        }
    }
}
