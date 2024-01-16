import {makeScene2D, Node, Txt, Polygon, PolygonProps} from '@motion-canvas/2d';
import {easeInOutCubic, tween} from '@motion-canvas/core/lib/tweening';
import {loop, all, createRef, useLogger} from '@motion-canvas/core';
import {createSignal, SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {initial, signal} from '@motion-canvas/2d/lib/decorators';

/// Author: Joseph Fuge

const F_X_OFFSET = -600;

function getPosition(crystalNum: number, radius: number) {
    let angleDegrees = crystalNum * 45; // Multiply by 30 degrees
    let angleRadians = angleDegrees * Math.PI / 180; // Convert to radians

    let x = 0 + radius * 1.34 * Math.cos(angleRadians);// * 2.75 ; // Calculate x position
    let y = 0 + radius * 1.34 * Math.sin(angleRadians) - 0.5; // Calculate y position

    const rotationAngle = angleDegrees - 90;
    return { x, y, rotationAngle };
}

interface CrystalProps extends PolygonProps {
  crystalNum?: SignalValue<number>;
  radius?: SignalValue<number>;
}

class Crystal extends Polygon {
  @initial(3)
  @signal()
  public declare readonly radius: SimpleSignal<number, this>; 

  @initial(0)
  @signal()
  public declare readonly crystalNum: SimpleSignal<number, this>; 

  private readonly rotationAngle = createSignal(0);

  public constructor(props?: CrystalProps) {
    super(props);

    let x = 0;
    let y = 0;
    let rotationAngle = 0;

    if (props) {
      const crystalNum = props.crystalNum.valueOf(); // Default to 0 if not provided
      const radiusValue = props.radius.valueOf();


      if (props.radius && typeof radiusValue === 'number' && typeof crystalNum === 'number') {
        ({ x, y, rotationAngle } = getPosition(crystalNum, radiusValue)); // Assuming 0,0 as center, adjust as needed
      }

    }

    this.rotationAngle(rotationAngle);

    this.add(<Polygon rotation={rotationAngle} height={150} y={y*45} x={x*45} width={50} sides={4} {...props}/>);
  }

  public *spin(duration: number, degrees: number) {
    yield* all(
      tween(duration, value => {
        const currentAngle = this.rotationAngle();
        this.rotationAngle(easeInOutCubic(value, currentAngle, degrees));
      }),
    );
  }
}

const Crystala = (props: CrystalProps) => {
  let x = 0;
  let y = 0;
  let rotationAngle = 0;

  if (props) {
    const crystalNum = props.crystalNum.valueOf(); // Default to 0 if not provided
    const radiusValue = props.radius.valueOf();
    if (props.radius && typeof radiusValue === 'number' && typeof crystalNum === 'number') {
      ({ x, y, rotationAngle } = getPosition(crystalNum, radiusValue)); // Assuming 0,0 as center, adjust as needed
    }
  }
  // const {x, y} = getPosition(props.crystalNum, radiusValue);

  // if (props.addedAngle) {
  //   const addedAngleValue = props.addedAngle.valueOf();
  //   if (typeof addedAngleValue === 'number') {
  //     rotationAngle += addedAngleValue;
  //   }
  // }

  return <Polygon rotation={rotationAngle} x={x*45} y={y*45} height={150} width={50} sides={4} {...props}/>;
};

export default makeScene2D(function* (view) {
  const functionF = createRef<Node>();

  const explanationText = createRef<Txt>();

  const crystal1Ref = createRef<Crystal>();
  const addAngleSignal = createSignal(0);
  // const add

  const CRYSTAL_RADIUS = 3.5;
  view.add(
    <>
      <Node ref={functionF} x={0}>
        <Txt fontFamily={'Calibri'} fill={'white'} fontSize={250}>f</Txt>
        <Crystal ref={crystal1Ref} fill={'white'} crystalNum={1} radius={CRYSTAL_RADIUS} /> 
        <Crystal fill={'white'} crystalNum={2} radius={CRYSTAL_RADIUS} />
        <Crystal fill={'white'} crystalNum={3} radius={CRYSTAL_RADIUS} /> 
        <Crystal fill={'white'} crystalNum={4} radius={CRYSTAL_RADIUS}/> 
        <Crystal fill={'white'} crystalNum={5} radius={CRYSTAL_RADIUS}/> 
        <Crystal fill={'white'} crystalNum={6} radius={CRYSTAL_RADIUS}/> 
        <Crystal fill={'white'} crystalNum={7} radius={CRYSTAL_RADIUS}/> 
        <Crystal fill={'white'} crystalNum={8} radius={CRYSTAL_RADIUS}/> 
      </Node>
      <Node x={0}>
        <Txt ref={explanationText} fontSize={0} fill={'white'}>{`Pure functions are deterministic.\n\nThey don\'t include side-effects such as:\n\n\nAccessing the file system\nRandom number generation\nMaking network calls`}
        </Txt>
      </Node>
      <Node x={-800} rotation={45} y={350}>
        <Txt fill='#50555e' fontSize={55}>{`Joseph Fuge`}</Txt>
      </Node>
    </>
  );

  yield* all(
    functionF().rotation(-359, 2),
    functionF().x(F_X_OFFSET, 2),
    explanationText().fontSize(60, 1),
    explanationText().x(350, 1),
  ); 
  yield* all(
    loop(5, function*() { yield* functionF().y(50, 1).to(1, 1);}),
    // crystal1Ref().spin(1, 90),
  );
  // yield* crystal1Ref().spin(1, 90);
//  yield* myCircle().position.x(300, 1).to(-300, 1);
});
