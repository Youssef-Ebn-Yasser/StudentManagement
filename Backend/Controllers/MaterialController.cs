using Backend.DTOs.MaterialDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.BaseResponse;
using Backend.Entities;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : AppControllerBase
    {
        private readonly IMaterialService _materialService;
        private readonly ResponseHandler _responseHandler;
        private const int DefaultPageSize = 10;

        public MaterialController(IMaterialService materialService, ResponseHandler responseHandler)
        {
            _materialService = materialService;
            _responseHandler = responseHandler;
        }

        // GET endpoints
        [HttpGet("GetMaterialsByLessonId/{lessonId}")]
        public async Task<IActionResult> GetMaterialsByLessonId(int lessonId, [FromQuery] int page = 1, [FromQuery] int pageSize = DefaultPageSize)
        {
            var result = await _materialService.GetMaterialsByLessonIdAsync(lessonId, page, pageSize);
            return NewResult<List<ShowMaterialDto>>(result);
        }

        [HttpGet("GetDeletedMaterials")]
        public async Task<IActionResult> GetDeletedMaterials([FromQuery] int page = 1, [FromQuery] int pageSize = DefaultPageSize)
        {
            var result = await _materialService.GetDeletedMaterialsAsync(page, pageSize);
            return NewResult<List<ShowMaterialDto>>(result);
        }

        // POST endpoints
        [HttpPost("CreateMaterial")]
        public async Task<IActionResult> CreateMaterial([FromForm] CreateMaterialDto createMaterialDto)
        {
            var result = await _materialService.CreateMaterialAsync(createMaterialDto, createMaterialDto.Data);
            return NewResult<string>(result);
        }

        // PUT endpoints
        [HttpPut("UpdateMaterial")]
        public async Task<IActionResult> UpdateMaterial([FromForm] UpdateMaterialDto updateMaterialDto)
        {
            var result = await _materialService.UpdateMaterialAsync(updateMaterialDto, updateMaterialDto.Data);
            return NewResult<string>(result);
        }

        [HttpPut("RestoreMaterial/{materialId}")]
        public async Task<IActionResult> RestoreMaterial(int materialId)
        {
            var result = await _materialService.RestoreMaterialAsync(materialId);
            return NewResult<string>(result);
        }

        // DELETE endpoints
        [HttpDelete("DeleteMaterial/{materialId}")]
        public async Task<IActionResult> DeleteMaterial(int materialId)
        {
            var result = await _materialService.DeleteMaterialAsync(materialId);
            return NewResult<string>(result);
        }
    }
} 