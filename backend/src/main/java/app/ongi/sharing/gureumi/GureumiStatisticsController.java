package app.ongi.sharing.gureumi;

import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.StatisticsResponse;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gureumi/internal")
class GureumiStatisticsController {

    private final GureumiStatisticsService statisticsService;

    GureumiStatisticsController(GureumiStatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/statistics")
    StatisticsResponse statistics(
        @RequestParam(required = false) String version,
        @RequestParam(defaultValue = "true") boolean completedAnswersOnly,
        @RequestParam(defaultValue = "true") boolean firstAttemptOnly,
        HttpServletResponse response
    ) {
        response.setHeader("Cache-Control", "no-store, max-age=0");
        response.setHeader("Pragma", "no-cache");
        return statisticsService.statistics(version, completedAnswersOnly, firstAttemptOnly);
    }
}
