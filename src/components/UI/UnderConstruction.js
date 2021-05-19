import styled, { keyframes } from "styled-components/macro";

const tr1 = "hsl(33,86%,27%)";
const tr2 = "hsl(34, 76%, 61%)";
const tr3 = "hsl(32, 59%, 45%)";
const t = "hsla(0,100%,50%,0)";
const gr1 = "hsl(97,48%,55%)";
const gr2 = "hsl(91,76%,73%)";
const or1 = "hsl(34,97%, 59%)";
const or2 = "hsl(30, 100%, 49%)";
const or3 = "hsl(30, 43%, 23%)";

// const getRandom = (min, max) => {
//   return Math.floor(Math.random() * (max - min) + min);
// };

const Container = styled.div`
  position: relative;
  margin: auto;
  display: block;
  width: 200px;
  height: 200px;
  // margin-bottom: 40px;
  background: none;

  & * {
    position: absolute;
  }

  .grass-oval {
    background: #689c54;
    width: 160px;
    height: 30px;
    border-radius: 100%;
    bottom: 0;
    left: 20px;
    box-shadow: 3px 1px 2px #37552b;
  }

  .trunk {
    bottom: 15px;
    left: 80px;
    width: 40px;
    height: 91px;

    background: radial-gradient(
          55% 180% at 10px 0px,
          ${gr1} 24%,
          ${tr1} 25%,
          ${tr1} 27%,
          ${t} 28%
        )
        10px -20px / 60px 70px,
      radial-gradient(
          45% 200% at -8.5px 115%,
          ${t} 17px,
          ${tr1} 17.5px,
          ${tr1} 19px,
          ${tr2} 19.5px,
          ${tr2} 23px,
          ${tr3} 23.5px,
          ${tr3} 29px,
          ${t} 30px
        )
        2px -99px / 150px 140px,
      radial-gradient(
          55% 200% at 41.5px 100%,
          ${t} 23%,
          ${tr1} 24%,
          ${tr1} 27%,
          ${tr3} 27%,
          ${tr3} 33%,
          ${t} 34%
        )
        0px -70px / 90px 110px,
      linear-gradient(
          90deg,
          ${tr1} 10%,
          ${tr2} 10%,
          ${tr2} 30%,
          ${tr3} 30%,
          ${tr3} 90%,
          ${tr1} 90%
        )
        10px 100% / 20px 90px;
    background-repeat: no-repeat;
  }

  .crown-back {
    top: 0;
    left: 0;
    width: 200px;
    height: 130px;

    background:
    //left-glare-front
      radial-gradient(50px 50px at 62px 56px, ${gr1} 50%, ${t} 51%) 10px 15px /
        75px 65px,
      radial-gradient(50px 50px at 62px 56px, ${gr2} 50%, ${t} 51%) 6px 14px /
        75px 65px,
      //
      //top-right-front
      radial-gradient(55% 78% at 15% 75%, ${gr1} 50%, ${t} 51%) 120px -10px / 50%
        50%,
      //top-left-front
      radial-gradient(45% 75% at 85% 75%, ${gr1} 50%, ${t} 51%) -39px -8px / 60%
        50%,
      //left-center-front
      radial-gradient(50% 50% at 160px 40px, ${gr1} 50%, ${t} 51%) -62px 22px / 280px
        96px,
      //top-left-back
      radial-gradient(
          45% 75% at 85% 75%,
          ${gr2} 45%,
          ${tr1} 47%,
          ${tr1} 50%,
          ${t} 53%
        ) -45px -14px / 60% 50%,
      //
      //top-center-front
      radial-gradient(50% 50% at 70px 70px, ${gr1} 50%, ${t} 51%) 28px -39px / 120px
        100px,
      //right-center-back
      radial-gradient(
          55% 60% at -10px 75%,
          ${gr1} 46%,
          ${tr1} 47%,
          ${tr1} 50%,
          ${t} 53%
        )
        159px 15px / 49% 45%,
      //
      //top-right-back
      radial-gradient(
          55% 78% at 15% 75%,
          ${gr2} 45%,
          ${tr1} 48%,
          ${tr1} 50%,
          ${t} 53%
        )
        126px -18px / 50% 50%,
      //
      //left-center-back
      radial-gradient(
          25% 35% at 100% 65%,
          ${gr2} 43%,
          ${tr1} 46%,
          ${tr1} 50%,
          ${t} 54%
        ) -104px 0px / 70% 70%,
      //
      //bottom-left-back
      radial-gradient(
          60% 65% at 90% 15%,
          ${gr1} 47%,
          ${tr1} 48%,
          ${tr1} 50%,
          ${t} 52%
        ) -80px 72px / 85% 80%,
      //
      //bottom-right-back
      radial-gradient(
          60% 65% at 60% 15%,
          ${gr1} 47%,
          ${tr1} 48%,
          ${tr1} 50%,
          ${t} 52%
        )
        26px 68px / 80% 80%,
      //
      // top-center-back
      radial-gradient(
          60% 65% at 45% 100%,
          ${gr2} 46%,
          ${tr1} 47%,
          ${tr1} 50%,
          ${t} 53%
        )
        45px -52px / 60% 60%;

    background-repeat: no-repeat;
  }

  .crown-front {
    bottom: 90px;
    left: 50px;
    width: 100px;
    height: 40px;
    // outline: 1px solid #aaa;

    background: radial-gradient(45px 35px at 10px 10px, ${gr1} 50%, ${t} 52%)
        14px 1px / 75px 65px,
      radial-gradient(45px 35px at 10px 10px, ${tr1} 50%, ${t} 52%) 16px 3px /
        75px 65px,
      //
      radial-gradient(40px 30px at 70px 10px, ${gr1} 50%, ${t} 52%) 0px 3px /
        73px 60px,
      radial-gradient(40px 30px at 70px 10px, ${tr1} 50%, ${t} 52%) 1px 6px /
        70px 60px;

    background-repeat: no-repeat;
  }
`;

const animation = (top) => {
  const bottom = 160 - top;

  return keyframes`
0% {
  transform: scale(0) translateY(0);
  background-color: ${or1};
}
50% {
  transform: scale(1) translateY(0);
  background-color: ${or2};
}
55% {
  transform: translateY(${bottom}px) scale(1);
  transform-origin: bottom;
  background-color: ${or2};
}
100% {
  transform: translateY(${bottom}px) scale(1.2, 0);
  transform-origin: bottom;
  background-color: ${or3};
}
`;
};

const Fruit = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  transform: scale(0);
  background-color: ${or1};
  // background: radial-gradient(100% 100% at 74% 75%, ${t} 60%, ${or1} 71%) 0 0 /
    30px 30px;
  // background-repeat: no-repeat;
  transition: all 0.25s;

  animation: ${(props) => animation(props.top)} 15s infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const UnderConstruction = () => {
  return (
    <>
      <Container>
        <div className="crown-back" />
        <div className="grass-oval" />
        <div className="trunk" />
        <div className="crown-front" />
        <Fruit left={25} top={10} delay={0} />
        <Fruit left={90} top={75} delay={6} />
        <Fruit left={140} top={35} delay={14} />
        <Fruit left={45} top={40} delay={8} />
      </Container>
      <h2>Site is ripening</h2>
    </>
  );
};

export default UnderConstruction;
