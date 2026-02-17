import {Composition} from 'remotion';
import {BlueprintPromo} from './BlueprintPromo';
import {NaturalPromo20s} from './NaturalPromo20s';
import {SlidePdfEdit} from './SlidePdfEdit';
import {blueprintConfig} from './blueprintTimeline';
import {naturalConfig} from './naturalTimeline';
import {compositionConfig} from './timeline';

export const Root = () => {
  return (
    <>
      <Composition
        id="SlidePdfEdit"
        component={SlidePdfEdit}
        durationInFrames={Math.floor(compositionConfig.durationSec * compositionConfig.fps)}
        fps={compositionConfig.fps}
        width={compositionConfig.width}
        height={compositionConfig.height}
      />
      <Composition
        id="BlueprintPromo"
        component={BlueprintPromo}
        durationInFrames={Math.floor(blueprintConfig.durationSec * blueprintConfig.fps)}
        fps={blueprintConfig.fps}
        width={blueprintConfig.width}
        height={blueprintConfig.height}
      />
      <Composition
        id="NaturalPromo20s"
        component={NaturalPromo20s}
        durationInFrames={Math.floor(naturalConfig.durationSec * naturalConfig.fps)}
        fps={naturalConfig.fps}
        width={naturalConfig.width}
        height={naturalConfig.height}
      />
    </>
  );
};
