document.addEventListener('DOMContentLoaded', () => {
    const bannerConfig = {
        show: true,
        startDate: '2025-08-25',
        endDate: '2025-09-26'
    };

    const banner = document.getElementById('banner');
    const closeBannerBtn = document.getElementById('close-banner-btn');
    const today = new Date().toISOString().split('T')[0];

    if (bannerConfig.show && today >= bannerConfig.startDate && today <= bannerConfig.endDate) {
        banner.classList.remove('hidden');
    }

    closeBannerBtn.addEventListener('click', () => {
        banner.style.display = 'none';
    });
});
