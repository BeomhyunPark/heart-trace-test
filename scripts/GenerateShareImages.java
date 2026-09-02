import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.GradientPaint;
import java.awt.Graphics2D;
import java.awt.GraphicsEnvironment;
import java.awt.RenderingHints;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Path2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

import javax.imageio.ImageIO;

public final class GenerateShareImages {
  private static final int WIDTH = 1200;
  private static final int HEIGHT = 630;
  private static final String FONT_FAMILY = findKoreanFont();

  private record Target(
    String slug,
    String title,
    String description,
    String eyebrow,
    String symbol,
    Color accent,
    Color secondary,
    String motif
  ) {}

  private static final Target[] TARGETS = {
    target("heart-trace", "마음속 흔적\n찾기", "내 마음과 가장 닮은 흔적이는 누구일까요?", "온기 · 성격검사", "✦", "#f48faa", "#ffc98f", "orbs"),
    target("balance-game", "극과 극\n밸런스 게임", "정답보다 서로의 이유가 더 재미있는 시간이에요.", "온기 · VS 놀이", "VS", "#ff8c68", "#55ddf2", "balance"),
    target("ideal-world-cup", "최애 월드컵", "하나만 남을 때까지 이어지는 취향 토너먼트.", "온기 · 토너먼트", "★", "#ffd36e", "#86d9f2", "trophy"),
    target("ideal-world-cup-meal", "든든한 한 끼\n최애 월드컵", "오늘 딱 하나만 고른다면? 든든한 한 끼 취향 토너먼트.", "온기 · 한 끼 월드컵", "★", "#ffd36e", "#86d9f2", "trophy"),
    target("ideal-world-cup-dessert", "디저트\n최애 월드컵", "달콤한 후보 중 마지막까지 남을 나의 최애 디저트는?", "온기 · 디저트 월드컵", "★", "#f48faa", "#ffd36e", "trophy"),
    target("ideal-world-cup-late-night", "야식\n최애 월드컵", "늦은 밤 가장 간절한 하나를 고르는 야식 토너먼트.", "온기 · 야식 월드컵", "★", "#b4a0ff", "#ff8c68", "trophy"),
    target("ideal-world-cup-travel", "여행지\n최애 월드컵", "지금 떠날 수 있다면 어디로? 여행 취향 토너먼트.", "온기 · 여행지 월드컵", "★", "#86d9f2", "#78e2c6", "trophy"),
    target("ideal-world-cup-free-pass", "평생 무료 이용권\n월드컵", "평생 하나가 무료라면? 가장 탐나는 이용권을 골라보세요.", "온기 · 무료 이용권 월드컵", "★", "#78e2c6", "#ffd36e", "trophy"),
    target("ideal-world-cup-life-cheat", "인생 치트키\n월드컵", "딱 하나 가질 수 있다면? 나만의 인생 치트키 토너먼트.", "온기 · 인생 치트키 월드컵", "★", "#c8adff", "#86d9f2", "trophy"),
    target("tool-ladder", "사다리 타기", "이름과 결과를 넣고 함께 사다리를 타보세요.", "온기 · 모임 도구", "↘", "#78e2c6", "#85a8ed", "ladder"),
    target("tool-lottery", "제비뽑기", "공평하고 간단하게 오늘의 주인공을 뽑아보세요.", "온기 · 모임 도구", "✓", "#80e0c2", "#f7d687", "lottery"),
    target("tool-prayer", "기도할 사람\n정하기", "함께 기도할 한 사람을 따뜻하게 정해보세요.", "온기 · 모임 도구", "✦", "#baf5e6", "#b4a0ff", "prayer"),
    target("tool-sharing", "나눔 순서\n정하기", "누가 먼저 시작할지 부담 없이 순서를 정해보세요.", "온기 · 모임 도구", "1", "#78e2c6", "#f48faa", "order"),
    target("tool-groups", "나눔 조\n편성하기", "함께할 사람들을 고르게 섞어 나눔 조를 만들어요.", "온기 · 모임 도구", "#", "#85a8ed", "#78e2c6", "groups"),
    target("tool-pairs", "원투원 짝\n정하기", "서로 함께할 원투원 짝을 공평하게 정해보세요.", "온기 · 모임 도구", "1:1", "#c8adff", "#78e2c6", "pairs"),
    target("tool-supporter", "기도 후원자\n정하기", "이번 주 서로를 위해 기도할 후원자를 연결해요.", "온기 · 모임 도구", "♡", "#f48faa", "#78e2c6", "supporter"),
  };

  private GenerateShareImages() {}

  public static void main(String[] args) throws IOException {
    Path texturePath = args.length > 0
      ? Path.of(args[0])
      : Path.of("scripts/assets/og-texture-v1.png");
    Path outputDirectory = args.length > 1
      ? Path.of(args[1])
      : Path.of("public/images/share");
    BufferedImage texture = ImageIO.read(texturePath.toFile());

    if (texture == null) {
      throw new IOException("공유 이미지 배경을 읽을 수 없습니다: " + texturePath);
    }

    Files.createDirectories(outputDirectory);
    for (Target target : TARGETS) {
      BufferedImage image = render(texture, target);
      File output = outputDirectory.resolve(target.slug() + "-v1.png").toFile();
      ImageIO.write(image, "png", output);
      System.out.println(output.getPath());
    }
  }

  private static Target target(
    String slug,
    String title,
    String description,
    String eyebrow,
    String symbol,
    String accent,
    String secondary,
    String motif
  ) {
    return new Target(
      slug,
      title,
      description,
      eyebrow,
      symbol,
      Color.decode(accent),
      Color.decode(secondary),
      motif
    );
  }

  private static BufferedImage render(BufferedImage texture, Target target) {
    BufferedImage output = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = output.createGraphics();
    graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
    graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

    drawTextureCover(graphics, texture);
    graphics.setPaint(new GradientPaint(0, 0, new Color(16, 11, 20, 215), 760, 0, new Color(22, 14, 27, 45)));
    graphics.fillRect(0, 0, WIDTH, HEIGHT);
    drawAmbientGlow(graphics, target.accent(), 990, 285, 285);
    drawAmbientGlow(graphics, target.secondary(), 855, 470, 215);
    drawCopy(graphics, target);
    drawMotif(graphics, target);

    graphics.setStroke(new BasicStroke(1.5f));
    graphics.setColor(withAlpha(target.accent(), 92));
    graphics.draw(new RoundRectangle2D.Double(1, 1, WIDTH - 3, HEIGHT - 3, 58, 58));
    graphics.dispose();
    return output;
  }

  private static void drawTextureCover(Graphics2D graphics, BufferedImage texture) {
    double scale = Math.max((double) WIDTH / texture.getWidth(), (double) HEIGHT / texture.getHeight());
    int drawWidth = (int) Math.ceil(texture.getWidth() * scale);
    int drawHeight = (int) Math.ceil(texture.getHeight() * scale);
    int x = (WIDTH - drawWidth) / 2;
    int y = (HEIGHT - drawHeight) / 2;
    graphics.drawImage(texture, x, y, drawWidth, drawHeight, null);
  }

  private static void drawAmbientGlow(Graphics2D graphics, Color color, int x, int y, int radius) {
    for (int index = 8; index >= 1; index--) {
      float ratio = index / 8f;
      int currentRadius = Math.round(radius * ratio);
      int alpha = Math.max(3, Math.round(8 * (1f - ratio) + 4));
      graphics.setColor(withAlpha(color, alpha));
      graphics.fillOval(x - currentRadius, y - currentRadius, currentRadius * 2, currentRadius * 2);
    }
  }

  private static void drawCopy(Graphics2D graphics, Target target) {
    graphics.setColor(target.secondary());
    graphics.setFont(font(Font.BOLD, 17));
    graphics.drawString(target.eyebrow(), 73, 178);

    graphics.setColor(new Color(255, 247, 239));
    graphics.setFont(font(Font.BOLD, 60));
    String[] lines = target.title().split("\\n");
    int lineY = lines.length == 1 ? 280 : 252;
    for (String line : lines) {
      graphics.drawString(line, 72, lineY);
      lineY += 76;
    }

    graphics.setColor(new Color(224, 210, 219));
    graphics.setFont(font(Font.PLAIN, 22));
    graphics.drawString(target.description(), 73, lines.length == 1 ? 347 : 405);

    graphics.setColor(withAlpha(target.secondary(), 230));
    graphics.setFont(font(Font.BOLD, 16));
    graphics.drawString("ONGI · SHARE AND START TOGETHER", 73, 565);
  }

  private static void drawMotif(Graphics2D graphics, Target target) {
    int centerX = 955;
    int centerY = 330;
    drawOrb(graphics, centerX, centerY, 172, withAlpha(target.accent(), 58));
    drawOrb(graphics, centerX - 85, centerY + 82, 92, withAlpha(target.secondary(), 86));
    drawOrb(graphics, centerX + 103, centerY - 98, 78, withAlpha(target.secondary(), 66));

    switch (target.motif()) {
      case "orbs" -> drawHeartTraceOrbs(graphics, target, centerX, centerY);
      case "balance" -> drawBalance(graphics, target, centerX, centerY);
      case "trophy" -> drawTrophy(graphics, target, centerX, centerY);
      case "cards" -> drawCards(graphics, target, centerX, centerY);
      case "ladder" -> drawLadder(graphics, target, centerX, centerY);
      case "lottery" -> drawLottery(graphics, target, centerX, centerY);
      case "prayer" -> drawPrayer(graphics, target, centerX, centerY);
      case "order" -> drawOrder(graphics, target, centerX, centerY);
      case "groups" -> drawGroups(graphics, target, centerX, centerY);
      case "pairs" -> drawPairs(graphics, target, centerX, centerY);
      case "supporter" -> drawSupporter(graphics, target, centerX, centerY);
      default -> drawCenteredSymbol(graphics, target.symbol(), target.accent(), centerX, centerY, 88);
    }
  }

  private static void drawHeartTraceOrbs(Graphics2D graphics, Target target, int x, int y) {
    int[][] orbs = {{-62, -42, 68}, {38, -68, 53}, {-18, 45, 58}, {76, 36, 43}, {-94, 70, 34}};
    for (int index = 0; index < orbs.length; index++) {
      int[] orb = orbs[index];
      graphics.setColor(withAlpha(index % 2 == 0 ? target.accent() : target.secondary(), 205));
      graphics.fillOval(x + orb[0] - orb[2], y + orb[1] - orb[2], orb[2] * 2, orb[2] * 2);
    }
    drawSpark(graphics, new Color(255, 247, 239), x + 8, y - 3, 58);
  }

  private static void drawBalance(Graphics2D graphics, Target target, int x, int y) {
    graphics.setColor(withAlpha(target.accent(), 205));
    graphics.fillOval(x - 138, y - 76, 150, 150);
    graphics.setColor(withAlpha(target.secondary(), 205));
    graphics.fillOval(x - 12, y - 76, 150, 150);
    drawCenteredSymbol(graphics, "VS", new Color(255, 247, 239), x, y + 1, 48);
  }

  private static void drawTrophy(Graphics2D graphics, Target target, int x, int y) {
    graphics.setStroke(new BasicStroke(12f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    graphics.setColor(target.accent());
    graphics.drawArc(x - 82, y - 80, 164, 128, 180, 180);
    graphics.drawLine(x - 52, y - 62, x - 34, y + 35);
    graphics.drawLine(x + 52, y - 62, x + 34, y + 35);
    graphics.drawLine(x, y + 34, x, y + 76);
    graphics.drawLine(x - 45, y + 83, x + 45, y + 83);
    drawCenteredSymbol(graphics, "★", target.secondary(), x, y - 5, 48);
  }

  private static void drawCards(Graphics2D graphics, Target target, int x, int y) {
    graphics.setColor(withAlpha(target.secondary(), 125));
    graphics.fillRoundRect(x - 98, y - 96, 156, 196, 28, 28);
    graphics.setColor(withAlpha(target.accent(), 220));
    graphics.fillRoundRect(x - 52, y - 72, 156, 196, 28, 28);
    drawCenteredSymbol(graphics, "ME", new Color(39, 27, 53), x + 26, y + 28, 43);
  }

  private static void drawLadder(Graphics2D graphics, Target target, int x, int y) {
    graphics.setStroke(new BasicStroke(9f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    graphics.setColor(target.accent());
    for (int column = -1; column <= 1; column++) {
      int lineX = x + column * 65;
      graphics.drawLine(lineX, y - 112, lineX, y + 112);
    }
    graphics.setColor(target.secondary());
    for (int row = -2; row <= 2; row++) {
      int lineY = y + row * 42;
      int startX = row % 2 == 0 ? x - 65 : x;
      graphics.drawLine(startX, lineY, startX + 65, lineY);
    }
  }

  private static void drawLottery(Graphics2D graphics, Target target, int x, int y) {
    graphics.rotate(-0.12, x, y);
    graphics.setColor(withAlpha(target.secondary(), 220));
    graphics.fillRoundRect(x - 104, y - 65, 208, 130, 26, 26);
    graphics.setStroke(new BasicStroke(4f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    graphics.setColor(withAlpha(new Color(27, 20, 32), 150));
    graphics.drawLine(x - 42, y - 50, x - 42, y + 50);
    drawCenteredSymbol(graphics, "✓", new Color(27, 55, 52), x + 27, y + 4, 62);
    graphics.rotate(0.12, x, y);
  }

  private static void drawPrayer(Graphics2D graphics, Target target, int x, int y) {
    for (int radius = 108; radius >= 48; radius -= 20) {
      graphics.setColor(withAlpha(target.accent(), 30));
      graphics.fillOval(x - radius, y - radius, radius * 2, radius * 2);
    }
    drawSpark(graphics, target.accent(), x, y, 98);
    graphics.setStroke(new BasicStroke(3f));
    graphics.setColor(withAlpha(target.secondary(), 170));
    graphics.drawOval(x - 122, y - 45, 244, 90);
  }

  private static void drawSpark(Graphics2D graphics, Color color, int x, int y, int radius) {
    Path2D spark = new Path2D.Double();
    spark.moveTo(x, y - radius);
    spark.curveTo(x + radius * 0.16, y - radius * 0.18, x + radius * 0.18, y - radius * 0.16, x + radius, y);
    spark.curveTo(x + radius * 0.18, y + radius * 0.16, x + radius * 0.16, y + radius * 0.18, x, y + radius);
    spark.curveTo(x - radius * 0.16, y + radius * 0.18, x - radius * 0.18, y + radius * 0.16, x - radius, y);
    spark.curveTo(x - radius * 0.18, y - radius * 0.16, x - radius * 0.16, y - radius * 0.18, x, y - radius);
    spark.closePath();
    graphics.setColor(color);
    graphics.fill(spark);
  }

  private static void drawOrder(Graphics2D graphics, Target target, int x, int y) {
    for (int index = 0; index < 3; index++) {
      int rowY = y - 88 + index * 88;
      graphics.setColor(index == 0 ? target.secondary() : withAlpha(target.accent(), 190));
      graphics.fillOval(x - 106, rowY - 30, 60, 60);
      graphics.setColor(withAlpha(new Color(255, 247, 239), 150));
      graphics.fillRoundRect(x - 24, rowY - 8, 136 - index * 18, 16, 16, 16);
      drawCenteredSymbol(graphics, Integer.toString(index + 1), new Color(31, 29, 46), x - 76, rowY + 1, 25);
    }
  }

  private static void drawGroups(Graphics2D graphics, Target target, int x, int y) {
    int[][] positions = {{-72, -60}, {62, -60}, {-72, 72}, {62, 72}};
    for (int index = 0; index < positions.length; index++) {
      int itemX = x + positions[index][0];
      int itemY = y + positions[index][1];
      graphics.setColor(index < 2 ? withAlpha(target.accent(), 210) : withAlpha(target.secondary(), 210));
      graphics.fillOval(itemX - 42, itemY - 42, 84, 84);
      drawCenteredSymbol(graphics, index < 2 ? "A" : "B", new Color(25, 30, 47), itemX, itemY + 1, 29);
    }
  }

  private static void drawPairs(Graphics2D graphics, Target target, int x, int y) {
    graphics.setStroke(new BasicStroke(11f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    graphics.setColor(withAlpha(new Color(255, 247, 239), 120));
    graphics.drawLine(x - 62, y, x + 62, y);
    graphics.setColor(target.accent());
    graphics.fillOval(x - 135, y - 72, 144, 144);
    graphics.setColor(target.secondary());
    graphics.fillOval(x - 9, y - 72, 144, 144);
    drawCenteredSymbol(graphics, "1", new Color(36, 31, 58), x - 63, y + 2, 45);
    drawCenteredSymbol(graphics, "1", new Color(28, 51, 52), x + 63, y + 2, 45);
  }

  private static void drawSupporter(Graphics2D graphics, Target target, int x, int y) {
    Path2D heart = new Path2D.Double();
    heart.moveTo(x, y + 94);
    heart.curveTo(x - 158, y + 8, x - 106, y - 105, x, y - 42);
    heart.curveTo(x + 106, y - 105, x + 158, y + 8, x, y + 94);
    graphics.setColor(withAlpha(target.accent(), 220));
    graphics.fill(heart);
    graphics.setStroke(new BasicStroke(5f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    graphics.setColor(target.secondary());
    graphics.drawArc(x - 64, y - 20, 128, 92, 205, 130);
    graphics.drawLine(x + 45, y + 23, x + 69, y + 21);
    graphics.drawLine(x + 45, y + 23, x + 52, y + 47);
  }

  private static void drawCenteredSymbol(
    Graphics2D graphics,
    String symbol,
    Color color,
    int centerX,
    int centerY,
    int size
  ) {
    graphics.setFont(font(Font.BOLD, size));
    graphics.setColor(color);
    var metrics = graphics.getFontMetrics();
    int x = centerX - metrics.stringWidth(symbol) / 2;
    int y = centerY + (metrics.getAscent() - metrics.getDescent()) / 2;
    graphics.drawString(symbol, x, y);
  }

  private static void drawOrb(Graphics2D graphics, int x, int y, int radius, Color color) {
    graphics.setComposite(AlphaComposite.SrcOver);
    graphics.setColor(color);
    graphics.fill(new Ellipse2D.Double(x - radius, y - radius, radius * 2.0, radius * 2.0));
  }

  private static Font font(int style, int size) {
    return new Font(FONT_FAMILY, style, size);
  }

  private static Color withAlpha(Color color, int alpha) {
    return new Color(color.getRed(), color.getGreen(), color.getBlue(), alpha);
  }

  private static String findKoreanFont() {
    String[] families = GraphicsEnvironment
      .getLocalGraphicsEnvironment()
      .getAvailableFontFamilyNames(Locale.KOREAN);
    for (String preferred : new String[] {"Noto Sans CJK KR", "Noto Sans KR", "SansSerif"}) {
      for (String family : families) {
        if (family.equalsIgnoreCase(preferred)) {
          return family;
        }
      }
    }
    return Font.SANS_SERIF;
  }
}
