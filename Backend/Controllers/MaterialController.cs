using Backend.DTOs.MaterialDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MaterialController : AppControllerBase
    {
        private readonly IMaterialService _materialService;

        public MaterialController(IMaterialService materialService)
        {
            _materialService = materialService;
        }

        [HttpGet("GetMaterialsByLessonId/{lessonId}")]
        public async Task<IActionResult> GetMaterialsByLessonId(int lessonId)
        {
            var result = await _materialService.GetAllMaterialByLessonIdAsync(lessonId);
            return NewResult(result);
        }

        [HttpPost("CreateMaterial")]
        public async Task<IActionResult> CreateMaterial([FromForm] CreateMaterialDto createMaterialDto)
        {
            var result = await _materialService.CreateAsync(createMaterialDto);
            return NewResult(result);
        }

        [HttpPut("UpdateMaterial")]
        public async Task<IActionResult> UpdateMaterial([FromForm] UpdateMaterialDto updateMaterialDto)
        {
            var result = await _materialService.UpdateAsync(updateMaterialDto);
            return NewResult(result);
        }

        [HttpDelete("DeleteMaterial/{materialId}")]
        public async Task<IActionResult> DeleteMaterial(int materialId)
        {
            var result = await _materialService.DeleteAsync(materialId);
            return NewResult(result);
        }
    }
} 