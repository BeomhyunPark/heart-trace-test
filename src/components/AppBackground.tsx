import { assetUrl } from '../utils/assetUrl';

export function AppBackground() {
  return (
    <div className="app-background" aria-hidden="true">
      <img className="app-background__nebula app-background__nebula--cyan" src={assetUrl('images/background/nebula-cyan.svg')} alt="" />
      <img className="app-background__nebula app-background__nebula--violet" src={assetUrl('images/background/nebula-violet.svg')} alt="" />
      <img className="app-background__nebula app-background__nebula--blue" src={assetUrl('images/background/nebula-blue.svg')} alt="" />
      <img className="app-background__nebula app-background__nebula--rose" src={assetUrl('images/background/nebula-rose.svg')} alt="" />
      <img className="app-background__flow app-background__flow--cyan" src={assetUrl('images/background/flow-cyan.svg')} alt="" />
      <img className="app-background__flow app-background__flow--violet" src={assetUrl('images/background/flow-violet.svg')} alt="" />
      <img className="app-background__star app-background__star--one" src={assetUrl('images/background/star-small.svg')} alt="" />
      <img className="app-background__star app-background__star--two" src={assetUrl('images/background/star-small.svg')} alt="" />
      <img className="app-background__star app-background__star--three" src={assetUrl('images/background/star-small.svg')} alt="" />
    </div>
  );
}
