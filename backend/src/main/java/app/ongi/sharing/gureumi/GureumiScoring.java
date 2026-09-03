package app.ongi.sharing.gureumi;

import org.springframework.stereotype.Component;

@Component
public class GureumiScoring {

    public int score(GureumiChoice choice, GureumiHighSide highSide) {
        int towardB = switch (choice) {
            case A_VERY -> 1;
            case A_LITTLE -> 2;
            case B_LITTLE -> 3;
            case B_VERY -> 4;
        };
        return highSide == GureumiHighSide.B ? towardB : 5 - towardB;
    }

    public AxisResult classify(int score) {
        if (score < 9 || score > 36) {
            throw new IllegalArgumentException("A trait score must be between 9 and 36.");
        }
        return new AxisResult(score, score >= 23 ? TraitLevel.HIGH : TraitLevel.LOW, score >= 21 && score <= 24);
    }

    public GureumiResultType resultFor(TraitLevel novelty, TraitLevel worry, TraitLevel relation) {
        if (novelty == TraitLevel.HIGH && worry == TraitLevel.LOW && relation == TraitLevel.HIGH) {
            return GureumiResultType.ARONG;
        }
        if (novelty == TraitLevel.LOW && worry == TraitLevel.LOW && relation == TraitLevel.LOW) {
            return GureumiResultType.DALMONG;
        }
        if (novelty == TraitLevel.LOW && worry == TraitLevel.HIGH && relation == TraitLevel.LOW) {
            return GureumiResultType.HOOWOO;
        }
        if (novelty == TraitLevel.HIGH && worry == TraitLevel.LOW && relation == TraitLevel.LOW) {
            return GureumiResultType.SUNNY;
        }
        if (novelty == TraitLevel.HIGH && worry == TraitLevel.HIGH && relation == TraitLevel.HIGH) {
            return GureumiResultType.CHOKCHOK;
        }
        if (novelty == TraitLevel.LOW && worry == TraitLevel.LOW && relation == TraitLevel.HIGH) {
            return GureumiResultType.MONGSIL;
        }
        if (novelty == TraitLevel.HIGH && worry == TraitLevel.HIGH && relation == TraitLevel.LOW) {
            return GureumiResultType.ELECTRIC;
        }
        return GureumiResultType.POGEUN;
    }

    public record AxisResult(int score, TraitLevel level, boolean nearBoundary) {}
}
