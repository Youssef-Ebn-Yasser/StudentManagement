using Backend.DTOs.MaterialDTOs;

namespace Backend.Services.Implementation
{
    public class MaterialService : ResponseHandler, IMaterialService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MaterialService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.LessonId == lessonId)
                .ToListAsync();

            var mappedMaterials = _mapper.Map<List<ShowMaterialDto>>(materials);
            return Success(mappedMaterials);
        }

        public async Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto)
        {
            var material = _mapper.Map<Material>(createMaterialDto);
            await _unitOfWork.Repository<Material>().AddAsync(material);
            _unitOfWork.Complete();
            return Success("Material Created Successfully");
        }

        public async Task<Response<string>> UpdateAsync(UpdateMaterialDto updateMaterialDto)
        {
            var existingMaterial = await _unitOfWork.Repository<Material>().GetByIdAsync(updateMaterialDto.Id);
            if (existingMaterial == null)
                return NotFound<string>("Material Not Found");

            _mapper.Map(updateMaterialDto, existingMaterial);
            _unitOfWork.Repository<Material>().Update(existingMaterial);
            _unitOfWork.Complete();
            return Success("Material Updated Successfully");
        }

        public async Task<Response<string>> DeleteAsync(int materialId)
        {
            var material = await _unitOfWork.Repository<Material>().GetByIdAsync(materialId);
            if (material == null)
                return NotFound<string>("Material Not Found");

            _unitOfWork.Repository<Material>().Delete(material);
            _unitOfWork.Complete();
            return Success("Material Deleted Successfully");
        }
    }
}