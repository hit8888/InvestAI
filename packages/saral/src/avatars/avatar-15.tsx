import React from 'react';

interface Avatar15Props {
  size?: number;
  className?: string;
}

export const Avatar15: React.FC<Avatar15Props> = ({ size = 50, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <g filter="url(#filter0_d_786_2585)">
        <rect x="5" y="5" width="50" height="50" rx="25" fill="#FFD4B8" />
        <rect x="5" y="5" width="50" height="50" rx="25" fill="url(#pattern0_786_2585)" />
        <rect
          x="5.4884"
          y="5.4884"
          width="49.0232"
          height="49.0232"
          rx="24.5116"
          stroke="white"
          strokeWidth="0.976801"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_786_2585"
          x="0.238095"
          y="0.238095"
          width="59.5238"
          height="59.5238"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.38095" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_786_2585" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_786_2585" result="shape" />
        </filter>
        <pattern id="pattern0_786_2585" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_786_2585" transform="translate(-0.00251256) scale(0.00502513)" />
        </pattern>
        <image
          id="image0_786_2585"
          width="200"
          height="199"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADHCAMAAABr0Ox5AAAABGdBTUEAALGPC/xhBQAAAdpQTFRF/3p6/4CA/3t7/5Ft/r9R/6hf/5Jt/3p6/8dI/3h4/spK/3p6/3t7NUJ/QVKg/6hgFBkwrV1tO0qQ/6NjxoxUn38voE1NX0wcYC4uXmrHcDU13rFCp2+dISlQMBYWxWRssG+Uh1+NV0h3m3i+0X2khYLm4r1tvn61r3w973R0l5nHqqOwR0BvhYHml4HW4r5tvX+10X6kLjpwIChQq3/Fn01NUCYmMBcX73NzsFRUgD09x36sIBkJn0xMIA8P/pRsvX61qoDFxrCP68JhtKel9cdWLjlw0H6kj4HeLTlwr1VVros0b1khzqU932xsr1RUIShQfILvoYDN432UjpXSc4f0hZDdvaua9XyDExkwQVKfQB4eEA0Ef2UlExgw/5RsoYDOoZ67c4L3DRAfO0mQNUF/QB8fLyYOj3Iq68Ji9MdW9nuD32trv1xccDY2z2RkPzMTEAcH7r5GT0AYfIzp7HyL2n2cNEKAVWrPtH+9joHeGiFAvpg4/5lp/plpVmrP2bl4/rxU/rJaSFqvQlKfO0mP/4pyJzFgGiBA/qhg/qNjT2K/NEGA/q1dBwgQ/p5mx36t/sFRYnvvDRAg/sZO/4V1/rdX/4B4/49vXHPfAAAAaYP//stL/3t7LZK3QwAAAA10Uk5TYBBw39/f398gIN+Av5KAOrIAAAbASURBVHja7d33e9NGGAdwulu69957t+zRMrqAUkLZm7ACJSkECoGMxsF7yq6tZUnn/7WSJduSJVknWa7fu973l+TJ8yTPfZ4b750en7LqvieoyKpVj7WoyOMMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAMwiAM8n+HiE0jOaIhYo2ro06SqVqOSEiu1EN0UudE0iBNCXlHapIE8WW0KSIpEHEQw0jsA2w0kJqAglJvwofIEsJJCTpErCO8FGFDcgLCDScDhiRQiKTgQnIoVDioEFEIB4lvxscLwZ7nvUyOFTLr83MutAMJ4hghm1V14ysvzQ430bvblTFCNm3ZsE3Vc/n6r7PDDSwjtfHOkYn9W07d1DE3exoukgMJ8vgn+8T+613NhIgipgRk1Zq1NKdvnPn7r7F1SVzL7+z6DcasUb+7FUFTAgRptdarKp/NnzU0V279EUoTR5fEB7msqoqmp5z9vav5Dxeu2CCbVHVK66TR1byMpZEAQTarvKI5Ymh4Q3Pjtxf3BUhkOJDXbB3i0FQKVVOzd98ox1ZskMuqovlFSZua074aCQ7krTe1wVlJ77E0Z/a+Hv+6FRvk5kkNI4ZG9SqeTTCQASPLpcmoVvHslZsaGAivhciS2o1VPDkwkEIYSEV15sqtT8BAvggDKav92QYG8l4YiFZ1ScBA3m2Xv3Tm0qX0fDDkFxfkUyiQd4z28WajKn3VXSmX54PG1p9QIG8bLbZGTF7L8M91G73G/OFdh60KFtJ61diLrCiNxkq6oa+vvVXsotnSZ/wWYGiQ9+3tvKj3Snenlc2Uy+nKigNyCS7kjh/Eex8JFzITCqKdhbr8tlqLtmauVfmQCzAgyDpzPWpYU6AcqrhvBAQ5p5mlxBA0VHUpVHE/BQcyp1mQdu3LO7pkDe+u9nmLUOV53XQdDuSctRyZy6xSVauKbe67j13tQ0khq5gnlGfBQObc7aymu4ttxuOxhM6wddoCFMhWj8PT4NPv2myvPD6laeuAQL50VzzcQ2Njqf2QcisIyJzHXMY8xSv6nvmE/vUACMjH/Q8Y1MDabiWtr1kn2sXnEATIYl/zeNwOudvb4+8AAJlxr1lTWNNDH4HVDG9KdgKA3HF1CN/AnB680v6iSw4CgCy4xstJzMdChYYFggFxThG9rOMtvUphqvNNdsiaGBPkguc2ildCPSP6YPyQGZ/TXzqMA0IdOeRcsipWrD1IYx4LsgAAcifgkXUFw/FhCzjEKBVPBjt2HwcOKfOdHcigXNgxbBNGDTF2IIUgx+6F4y0YkEMDTubVrG8VmVcWFw8u7DoeRwGIBzLnv7fd419L8ur3rdgykoKImXyMjrggX0WBvNGCB/k2CuQfgJCZC5RAWt/QAuk8nyMfMrNICcR1SiQX0przHl4KcRCdsmvn4oFO+5X5dKaSP7G0QiCkm2udM2J1isCh5QEpKATMETE3uWxk0uM6sQnx3/gCgYjLxZTzZkJSKk2K/ZCCAnnVkpc5v9sV9VSpKXchAd0xXohYCrwrWU/VdM21wO4YI0SuSbgfEU++kAVbEJupMBfa7kGt7Akp3EUKmBC5FPZ2IUhIBAZISE2IctsIHKQZ7UYeNEhTinqRDRRELiI0UsgPtq3ACCHbhegO9DUWpPPWl+YIL4uJEhoqh4Mdt68i+ztshtT4QGrCcA708+0wjp4mXsiw3WHkx6NhHZaGi/Z+IS/I0N1h9sn5QY6jVwde5ysmckNDZA7FlGP+jvPTwddFpWJuGEjUEug5vHw65cgx3HdbiJEhRRRr7nmsXkd+msb/A9gUJySOWd5POX/EOTnCMIwTZyICJJ5Z7rZ8fthcjG9/duyj8L+O1yk2iJxCI8z01emov4r14qceJM5ZHndK+BC5iCCniAuB3B1miZSxIEUEPkkxGCImEQGpi0GQES268UvkwZBHESlJypRABr6HgCjIoFWYLMiAykgYxP+VCqRBfF+QRhrEd8ITB/Gb8ORBfKYJgRDvCk8gxHtwkQhBOVogEi0Qr/lOJqROCwQlaIFItEDcL60jFVKjBSLRAnGNLWIhCVogHC0QgRZI/zaFXEiRFohAC6RvbBEMKdECkWiBOIs7yZAaLRCJFohjbBENSdAC4WiB2N+kTTTEXtzJhhRpgQi0QGxji3BIiRaIhAcR4H9KRcSBcCL8LqkFQ6Rm2P9AN9ax5QdJGuvBdoI2jt4QYXkUn2Ye6cbRCyI8bzElAiCcP+Tp7laMhI/WdTaOLojtf/cSMNd7xV2HrLblwQce6eXh1STkIbOx9/8LYLTSBjxzZQ4AAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
};
