import { BrandMark } from '../components/BrandMark';

export function SplashScreen() {
  return (
    <main className="splash-screen" role="status" aria-label="온기 앱을 여는 중">
      <div className="splash-screen__content">
        <BrandMark size="splash" />
        <h1>온기</h1>
        <p>우리 사이에 온기를</p>
        <small>함께 웃고, 묻고, 가까워지는 시간</small>
      </div>
    </main>
  );
}
