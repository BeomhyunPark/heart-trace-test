package app.ongi.sharing.gureumi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

class GureumiScoringTest {

    private final GureumiScoring scoring = new GureumiScoring();

    @Test
    void scoresBothQuestionDirectionsWithoutExposingDirectionToTheClient() {
        assertThat(scoring.score(GureumiChoice.A_VERY, GureumiHighSide.A)).isEqualTo(4);
        assertThat(scoring.score(GureumiChoice.A_LITTLE, GureumiHighSide.A)).isEqualTo(3);
        assertThat(scoring.score(GureumiChoice.B_LITTLE, GureumiHighSide.A)).isEqualTo(2);
        assertThat(scoring.score(GureumiChoice.B_VERY, GureumiHighSide.A)).isEqualTo(1);

        assertThat(scoring.score(GureumiChoice.A_VERY, GureumiHighSide.B)).isEqualTo(1);
        assertThat(scoring.score(GureumiChoice.A_LITTLE, GureumiHighSide.B)).isEqualTo(2);
        assertThat(scoring.score(GureumiChoice.B_LITTLE, GureumiHighSide.B)).isEqualTo(3);
        assertThat(scoring.score(GureumiChoice.B_VERY, GureumiHighSide.B)).isEqualTo(4);
    }

    @ParameterizedTest(name = "{0} axis boundaries")
    @EnumSource(TraitAxis.class)
    void classifiesRequiredScoreBoundariesForEveryAxis(TraitAxis axis) {
        assertThat(scoring.classify(9)).isEqualTo(new GureumiScoring.AxisResult(9, TraitLevel.LOW, false));
        assertThat(scoring.classify(22)).isEqualTo(new GureumiScoring.AxisResult(22, TraitLevel.LOW, true));
        assertThat(scoring.classify(23)).isEqualTo(new GureumiScoring.AxisResult(23, TraitLevel.HIGH, true));
        assertThat(scoring.classify(36)).isEqualTo(new GureumiScoring.AxisResult(36, TraitLevel.HIGH, false));
        assertThat(axis).isIn(TraitAxis.NOVELTY, TraitAxis.WORRY, TraitAxis.RELATION);
    }

    @Test
    void mapsAllEightTraitCombinations() {
        assertThat(result(TraitLevel.HIGH, TraitLevel.LOW, TraitLevel.HIGH)).isEqualTo(GureumiResultType.ARONG);
        assertThat(result(TraitLevel.LOW, TraitLevel.LOW, TraitLevel.LOW)).isEqualTo(GureumiResultType.DALMONG);
        assertThat(result(TraitLevel.LOW, TraitLevel.HIGH, TraitLevel.LOW)).isEqualTo(GureumiResultType.HOOWOO);
        assertThat(result(TraitLevel.HIGH, TraitLevel.LOW, TraitLevel.LOW)).isEqualTo(GureumiResultType.SUNNY);
        assertThat(result(TraitLevel.HIGH, TraitLevel.HIGH, TraitLevel.HIGH)).isEqualTo(GureumiResultType.CHOKCHOK);
        assertThat(result(TraitLevel.LOW, TraitLevel.LOW, TraitLevel.HIGH)).isEqualTo(GureumiResultType.MONGSIL);
        assertThat(result(TraitLevel.HIGH, TraitLevel.HIGH, TraitLevel.LOW)).isEqualTo(GureumiResultType.ELECTRIC);
        assertThat(result(TraitLevel.LOW, TraitLevel.HIGH, TraitLevel.HIGH)).isEqualTo(GureumiResultType.POGEUN);
    }

    private GureumiResultType result(TraitLevel novelty, TraitLevel worry, TraitLevel relation) {
        return scoring.resultFor(novelty, worry, relation);
    }
}
