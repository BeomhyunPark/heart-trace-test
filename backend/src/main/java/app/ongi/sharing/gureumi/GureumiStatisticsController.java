package app.ongi.sharing.gureumi;

import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.StatisticsResponse;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gureumi/internal")
class GureumiStatisticsController {

    static final String ADMIN_HEADER = "X-Gureumi-Admin-Key";

    private final GureumiAdminAccess adminAccess;
    private final GureumiStatisticsService statisticsService;

    GureumiStatisticsController(
        GureumiAdminAccess adminAccess,
        GureumiStatisticsService statisticsService
    ) {
        this.adminAccess = adminAccess;
        this.statisticsService = statisticsService;
    }

    @GetMapping("/statistics")
    StatisticsResponse statistics(
        @RequestHeader(value = ADMIN_HEADER, required = false) String adminKey,
        @RequestParam(required = false) String version,
        @RequestParam(defaultValue = "true") boolean completedAnswersOnly,
        @RequestParam(defaultValue = "true") boolean firstAttemptOnly,
        HttpServletResponse response
    ) {
        response.setHeader("Cache-Control", "no-store, max-age=0");
        response.setHeader("Pragma", "no-cache");
        adminAccess.require(adminKey);
        return statisticsService.statistics(version, completedAnswersOnly, firstAttemptOnly);
    }
}
