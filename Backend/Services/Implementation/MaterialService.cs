using Backend.DTOs.MaterialDTOs;
using Backend.Services.Interfaces;
using Backend.BaseResponse;
using Backend.Entities;
using AutoMapper;
using Backend.UniteOfWork;
using Microsoft.AspNetCore.Http;

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

        public async Task<Response<List<ShowMaterialDto>>> GetAllMaterialByLessonIdAsync(int lessonId, int page = 1, int pageSize = 10)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.LessonId == lessonId && m.IsDeleted == false)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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

            material.IsDeleted = true;
            _unitOfWork.Repository<Material>().Update(material);
            _unitOfWork.Complete();
            return Success("Material Deleted Successfully");
        }

        public async Task<Response<List<ShowMaterialDto>>> GetMaterialsByLessonIdAsync(int lessonId, int page = 1, int pageSize = 10)
        {
            return await GetAllMaterialByLessonIdAsync(lessonId, page, pageSize);
        }

        public async Task<Response<List<ShowMaterialDto>>> GetDeletedMaterialsAsync(int page = 1, int pageSize = 10)
        {
            var materials = await _unitOfWork.Repository<Material>()
                .GetTableNoTracking()
                .Where(m => m.IsDeleted)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedMaterials = _mapper.Map<List<ShowMaterialDto>>(materials);
            return Success(mappedMaterials);
        }

        public async Task<Response<string>> CreateMaterialAsync(CreateMaterialDto createMaterialDto, IFormFile? file)
        {
            if (file != null)
            {
                createMaterialDto.Data = file;
            }
            return await CreateAsync(createMaterialDto);
        }

        public async Task<Response<string>> UpdateMaterialAsync(UpdateMaterialDto updateMaterialDto, IFormFile? file)
        {
            if (file != null)
            {
                updateMaterialDto.Data = file;
            }
            return await UpdateAsync(updateMaterialDto);
        }

        public async Task<Response<string>> RestoreMaterialAsync(int materialId)
        {
            var material = await _unitOfWork.Repository<Material>().GetByIdAsync(materialId);
            if (material == null)
                return NotFound<string>("Material Not Found");

            if (!material.IsDeleted)
                return BadRequest<string>("Material is already active");

            material.IsDeleted = false;
            _unitOfWork.Repository<Material>().Update(material);
            _unitOfWork.Complete();
            return Success("Material Restored Successfully");
        }

        public async Task<Response<string>> DeleteMaterialAsync(int materialId)
        {
            return await DeleteAsync(materialId);
        }
    }
}