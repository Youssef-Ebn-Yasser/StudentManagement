using Backend.DTOs.MaterialDTOs;
using Backend.Services.Interfaces;
using Backend.UniteOfWork;
using AutoMapper;

namespace Backend.Services.Implementation
{
    public class MaterialService : ResponseHandler, IMaterialService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ResponseHandler _responseHandler;

        public MaterialService(IUnitOfWork unitOfWork, IMapper mapper, ResponseHandler responseHandler)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _responseHandler = responseHandler;
        }

        public async Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.LessonId == lessonId)
                .ToListAsync();

            var mappedMaterials = _mapper.Map<List<ShowMaterialDto>>(materials);
            return _responseHandler.Success(mappedMaterials);
        }

        public async Task<Response<string>> CreateAsync(CreateMaterialDto createMaterialDto)
        {
            var material = _mapper.Map<Material>(createMaterialDto);
            await _unitOfWork.Repository<Material>().AddAsync(material);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Material Created Successfully");
        }

        public async Task<Response<string>> UpdateAsync(UpdateMaterialDto updateMaterialDto)
        {
            var existingMaterial = await _unitOfWork.Repository<Material>().GetByIdAsync(updateMaterialDto.Id);
            if (existingMaterial == null)
                return _responseHandler.NotFound<string>("Material Not Found");

            _mapper.Map(updateMaterialDto, existingMaterial);
            await _unitOfWork.Repository<Material>().UpdateAsync(existingMaterial);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Material Updated Successfully");
        }

        public async Task<Response<string>> DeleteAsync(int materialId)
        {
            var material = await _unitOfWork.Repository<Material>().GetByIdAsync(materialId);
            if (material == null)
                return _responseHandler.NotFound<string>("Material Not Found");

            await _unitOfWork.Repository<Material>().DeleteAsync(material);
            await _unitOfWork.CompleteAsync();
            return _responseHandler.Success("Material Deleted Successfully");
        }
    }
} 