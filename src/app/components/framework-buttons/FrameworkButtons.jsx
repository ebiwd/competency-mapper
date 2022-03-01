import React from 'react';

import FrameworkButton from '../framework-button/FrameworkButton';

// function FrameworkButtons({ frameworks }) {
//   const selfRef = new React.createRef();

//   const invokeFoundation = () => {
//     // window.setTimeout(() => $(selfRef.current).foundation());
//     return (
//       <div className="vf-grid vf-grid__col-3">
//         {' '}
//         {frameworks.map(framework => (
//           // <FrameworkButton key={framework.nid} framework={framework} />
//           <div>hi</div>
//         ))}
//       </div>
//     );
//   };

//   return frameworks.length < 1 ? null : (
//     <div className="row" data-equalizer ref={selfRef}>
//       {invokeFoundation()}
//     </div>
//   );
// }

function FrameworkButtons({ frameworkDetails }) {
  // const selfRef = new React.createRef();

  // const invokeFoundation = () => {
  // window.setTimeout(() => $(selfRef.current).foundation());
  return (
    <section
      className="vf-card-container vf-card-container__col-3"
      style={{ margin: '0' }}
    >
      <div className="vf-card-container__inner">
        {console.log(frameworkDetails)}
        {frameworkDetails.map(framework => (
          <FrameworkButton
            desc={framework.desc}
            sub_text={framework.sub_text}
            card_link={framework.card_link}
          />
        ))}
      </div>
    </section>
  );
  // };

  // return frameworks.length < 1 ? null : (
  //   <div className="row" data-equalizer ref={selfRef}>
  //     {invokeFoundation()}
  //   </div>
  // );
}

export default FrameworkButtons;
