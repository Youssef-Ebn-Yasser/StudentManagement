using Backend.DTOs.SliderDTOs;
using Backend.Entities;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using static System.Net.Mime.MediaTypeNames;

public class SliderService : ISliderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhysicalFileUpload _fileUpload;

    public SliderService(IUnitOfWork unitOfWork, IPhysicalFileUpload fileUpload)
    {
        _unitOfWork = unitOfWork;
        _fileUpload = fileUpload;
    }

    public async Task<List<SliderDto>> GetAllAsync()
    {
        var sliders = await _unitOfWork.Repository<Slider>()
            .GetTableNoTracking()
            .ToListAsync();
        return sliders.Select(s => new SliderDto
        {
            Id = s.Id,
            Content = GeneralLocalizableEntity.Localized(s.ContentAr,s.ContentEn),
            Path = s.Path,
            Link = s.Link
        }).ToList();
    }

    public async Task<SliderDto> AddAsync(CreateSliderDto dto)
    {
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            var path = await _fileUpload.UploadFileAsync("slider", dto.Image);
            var slider = new Slider
            {
                ContentAr = dto.Content,
                Path = path ?? string.Empty,
                Link = dto.Link
            };
            await _unitOfWork.Repository<Slider>().AddAsync(slider);
            _unitOfWork.Complete();
            return new SliderDto
            {
                Id = slider.Id,
                Content = slider.ContentAr,
                Path = slider.Path,
                Link = slider.Link
            };
        }
        else
        {
            var path = await _fileUpload.UploadFileAsync("slider", dto.Image);
            var slider = new Slider
            {
                ContentEn = dto.Content,
                Path = path ?? string.Empty,
                Link = dto.Link
            };
            await _unitOfWork.Repository<Slider>().AddAsync(slider);
            _unitOfWork.Complete();
            return new SliderDto
            {
                Id = slider.Id,
                Content = slider.ContentEn,
                Path = slider.Path,
                Link = slider.Link
            };
        }
        
    }

    public async Task<SliderDto> UpdateAsync(UpdateSliderDto dto)
    {
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;

        if (cultureInfo.TwoLetterISOLanguageName.ToLower().Equals("ar"))
        {
            var slider = await _unitOfWork.Repository<Slider>()
            .GetTableAsTracking()
            .FirstOrDefaultAsync(s => s.Id == dto.Id);
            if (slider == null) throw new Exception("Slider not found");
            slider.ContentAr = dto.Content;
            slider.Link = dto.Link;
            if (dto.Image != null)
            {
                var path = await _fileUpload.UploadFileAsync("slider", dto.Image);
                slider.Path = path ?? slider.Path;
            }
            _unitOfWork.Repository<Slider>().Update(slider);
            _unitOfWork.Complete();
            return new SliderDto
            {
                Id = slider.Id,
                Content = slider.ContentAr,
                Path = slider.Path,
                Link = slider.Link
            };
        }
        else
        {
            var slider = await _unitOfWork.Repository<Slider>()
            .GetTableAsTracking()
            .FirstOrDefaultAsync(s => s.Id == dto.Id);
            if (slider == null) throw new Exception("Slider not found");
            slider.ContentEn = dto.Content;
            slider.Link = dto.Link;
            if (dto.Image != null)
            {
                var path = await _fileUpload.UploadFileAsync("slider", dto.Image);
                slider.Path = path ?? slider.Path;
            }
            _unitOfWork.Repository<Slider>().Update(slider);
            _unitOfWork.Complete();
            return new SliderDto
            {
                Id = slider.Id,
                Content = slider.ContentEn,
                Path = slider.Path,
                Link = slider.Link
            };
        }
        
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var slider = await _unitOfWork.Repository<Slider>()
            .GetTableAsTracking()
            .FirstOrDefaultAsync(s => s.Id == id);
        if (slider == null) return false;
        _unitOfWork.Repository<Slider>().Delete(slider);
        _unitOfWork.Complete();
        return true;
    }
} 