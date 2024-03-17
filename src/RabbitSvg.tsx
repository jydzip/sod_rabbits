import styled from "styled-components"
import { motion } from "framer-motion"

const LINE_PATHS = [
    "m 73.99326,9.1871747 c 0.217212,0.3804456 0.349006,0.3807691 0.703703,0.9735583 0.348873,0.583056 0.53941,1.249392 0.81147,1.873037 0.545348,1.250105 1.532771,3.654708 1.577852,3.79176 0.04508,0.137052 0.78844,2.20491 1.296096,3.254975 0.219393,0.453808 0.443411,0.91467 0.800195,1.267728 0.524756,0.519274 1.242221,0.802683 1.915967,1.096412 0.469384,0.204635 0.982094,0.288007 1.46515,0.456839 0.357486,0.124944 1.270055,0.658023 1.059415,0.411155 -0.03216,-0.03769 -0.628899,-0.442099 -0.969253,-0.616733 C 81.997856,21.359317 81.329187,21.318488 80.670268,20.987807 80.21415,20.758902 79.636587,20.456768 79.29528,20.07413 78.459145,19.136743 78.2073,17.799793 77.694886,16.64784 77.177557,15.484836 76.710417,14.299526 76.207196,13.130183 75.740612,12.045979 75.476198,10.841335 74.787127,9.886629 74.358186,9.2923335 73.885678,8.9987448 73.99326,9.1871747 Z",
    "m 89.937278,45.309973 c -0.180329,0.09853 -2.604042,0.849406 -3.949954,1.073108 -1.640052,0.272591 -3.322864,0.48271 -4.9774,0.319651 -1.175802,-0.115878 -2.41958,-0.292445 -3.424814,-0.913286 -0.90825,-0.560943 -1.534726,-1.506837 -2.123388,-2.397371 -0.645777,-0.976938 -1.52472,-3.02531 -1.506918,-3.173661 0.01267,-0.105557 0.489734,0.90738 0.776291,1.392758 0.320117,0.542224 0.664906,1.174749 1.027445,1.689576 0.564065,0.801006 1.193913,1.616144 2.032058,2.123385 0.962352,0.58241 2.125192,0.803043 3.242159,0.936117 1.376749,0.164024 2.842411,0.03854 4.220022,-0.118079 1.291861,-0.146866 2.692565,-0.437244 3.771212,-0.772374 0.255312,-0.07932 0.394471,-0.118303 0.658515,-0.160225 0.156759,-0.02489 0.284614,-0.01591 0.284614,-0.01591 z",
    "m 64.643518,67.194387 c 0.547324,1.636325 -2.630665,-5.151557 -3.164367,-7.910922 -0.341382,-1.765026 -0.206931,-3.597976 -0.09687,-5.39234 0.06588,-1.074135 0.49063,-4.272119 0.452054,-3.196656 -0.0041,0.11529 -0.17333,2.517484 -0.161446,3.777866 0.01484,1.574334 0.003,3.166356 0.290605,4.714264 0.509324,2.740988 2.680024,8.007788 2.680024,8.007788 z",
    "m 50.869926,53.983878 c -0.110736,0.362024 1.021611,5.111142 1.031837,5.631693 0.02446,1.244964 -0.338563,4.336479 -1.026774,5.315291 -0.297149,0.422623 -1.021357,1.812959 -2.288274,2.432627 -1.314431,0.642907 -3.325951,0.524182 -4.782515,0.663754 -1.951375,0.186983 -3.733204,0.47566 -5.560428,1.185647 -0.920581,0.357701 -2.608681,1.293501 -2.306043,1.2101 0.201477,-0.05552 2.530369,-0.917369 3.835794,-1.232932 1.364537,-0.329852 3.927124,-0.684964 4.155443,-0.684964 1.506919,0 3.027028,-0.198947 4.520756,0 0.922355,0.122847 1.833642,0.435373 2.60286,0.95895 0.80029,0.544726 1.340277,1.267621 1.939582,2.0279 0.0736,0.09336 0.242601,0.313056 0.254903,0.293882 0.06821,-0.106319 -0.737821,-1.579858 -1.326864,-2.18479 -0.5611,-0.576236 -1.369059,-0.852909 -2.100554,-1.18727 -0.205802,-0.09407 -0.514561,-0.187735 -0.518213,-0.413984 -0.01488,-0.921565 1.49875,-1.753313 2.035975,-2.976821 0.935357,-2.130237 1.065501,-4.971087 1.039434,-5.285393 -0.163863,-1.975801 -1.399493,-6.104894 -1.506919,-5.75369 z",
    "m 21.819203,63.43935 c -0.0182,-0.09522 0.05281,0.877482 0.137636,1.284892 0.177941,0.854701 0.465404,1.690031 0.823382,2.48629 0.49733,1.106222 1.045613,2.218371 1.824355,3.148224 0.64239,0.767043 1.703322,1.480767 2.567013,1.9858 1.26418,0.739215 3.606035,1.92394 3.514333,1.804521 -0.02696,-0.03511 -2.42952,-1.406004 -3.675779,-2.191994 -0.760006,-0.47932 -1.60601,-1.19482 -2.082672,-1.711341 C 24.101857,69.351089 23.52156,68.240155 23.022392,67.129807 22.6671,66.339496 22.48886,65.75626 22.215155,64.934123 22.085027,64.543252 21.851684,63.609253 21.819203,63.43935 Z",
    "m 78.633764,56.806271 c -0.405686,0.347405 -1.00791,3.439079 -1.506919,5.160058 -0.291132,1.004056 -0.737048,1.976611 -0.867622,3.013837 -0.127436,1.012298 -0.183797,2.077008 0.09133,3.059501 0.174624,0.623592 0.455317,1.282493 0.958948,1.689576 0.670174,0.541699 1.638555,0.535204 2.465869,0.77629 0.620345,0.180774 1.312703,0.179143 1.872231,0.502307 0.540578,0.312219 0.910423,0.856887 1.324264,1.324263 0.29471,0.332834 0.818487,0.76595 1.072197,1.131001 0.147169,0.211753 0.247736,0.04446 0.07519,-0.172771 -0.163995,-0.206462 -0.58908,-0.759277 -0.924365,-1.256438 -0.355114,-0.526562 -0.821822,-1.01595 -1.364623,-1.345708 -1.275937,-0.775147 -3.171058,-0.293013 -4.292436,-1.278599 -0.563015,-0.494838 -0.78306,-1.048691 -0.945572,-1.780429 -0.174938,-0.787685 -0.414636,-1.994635 -0.01337,-2.694662 0.572752,-0.999193 2.079564,-0.865096 2.997692,-1.560418 0.120123,-0.09097 0.230021,-0.02923 0.100786,-0.10666 -0.08318,-0.04983 -1.884686,1.00317 -2.366395,0.567249 -0.511912,-0.463252 0.05403,-1.168829 0.283946,-2.233658 0.30897,-1.430972 1.101829,-4.857718 1.038854,-4.794743 z"
]

const RabbitSvg: React.FC = () => {
    return (
        <SvgRabbitGlobal>
            <SvgRabbit
                viewBox="0 0 82.020862 76.866749"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform="translate(-17.307156,-0.38747366)">
                    <motion.path
                        d="m 64.112547,1.8265682 c -0.63913,3.9685377 0.365313,10.7767528 0.365313,10.7767528 0,0 0.935898,4.401375 1.826566,6.205743 1.035463,2.097704 4.018452,5.301637 4.018452,5.301637 l 1.004613,2.465866 c 0,0 -0.601728,2.75039 -1.18727,4.018452 -0.350443,0.758927 -1.369926,2.100554 -1.369926,2.100554 l -3.835794,0.182655 c 0,0 -3.503343,-0.91233 -5.297048,-1.095941 -2.422764,-0.248005 -4.887865,-0.287388 -7.306273,0 -3.482765,0.41387 -6.972014,1.164174 -10.228781,2.465869 -2.938289,1.174403 -5.78315,2.729999 -8.219559,4.749077 -2.443276,2.02477 -4.77077,4.559353 -6.575645,7.16928 -1.518728,2.196147 -2.520414,4.436616 -3.561807,6.895294 -0.758584,1.790979 -1.351378,3.830809 -1.643912,5.753691 -0.233513,1.534922 -0.285401,4.623501 -0.285401,4.623501 0,0 -1.750342,-0.334213 -2.431619,-0.0685 -0.721978,0.281589 -1.200114,1.252261 -1.221519,1.917897 -0.04105,1.276547 0.156633,1.818421 0.559387,2.751268 0.567277,1.313906 1.573749,2.434163 2.648525,3.379153 0.984146,0.865304 2.15349,1.545491 3.379151,2.009224 1.072188,0.405666 3.37915,0.6393 3.37915,0.6393 l 2.557196,0.09133 c 0,0 1.656706,1.032646 2.509237,1.332099 2.166405,0.760953 6.623605,0.859783 6.623605,0.859783 l 5.023062,-0.09133 c 0,0 3.256114,0.07472 4.690037,-0.54797 0.475522,-0.206497 1.154981,-1.004613 1.154981,-1.004613 0,0 1.335772,0.357335 1.917899,0.09133 0.492987,-0.225272 0.881447,-0.750757 1.004612,-1.278596 0.134316,-0.57563 -0.365315,-1.735241 -0.365315,-1.735241 l 2.739853,-1.18727 c 0,0 2.368278,-1.046902 3.872672,-1.610672 1.567002,-0.673188 3.136425,-1.307051 4.803526,-1.677151 0,0 1.8339,2.598513 2.831181,3.835794 0.839292,1.041271 1.503663,2.10779 2.465868,3.036669 0.622579,0.601016 1.780903,1.643912 1.780903,1.643912 0,0 4.294764,0.271184 6.347326,0.159825 1.134952,-0.06158 2.299102,-0.102515 3.37915,-0.456641 0.362461,-0.118844 0.656501,-0.392019 1.004612,-0.547971 0.413013,-0.185028 0.945493,-0.150283 1.278599,-0.456642 0.270746,-0.249006 0.456642,-1.004612 0.456642,-1.004612 l 0.54797,-0.273987 1.82657,-0.54797 c 0,0 0.377125,-0.470208 0.456641,-0.730627 0.234877,-0.76923 -0.544983,-1.474808 -1.050279,-2.100554 C 85.52509,69.29583 84.996421,69.146081 84.341789,68.81596 83.286226,68.283655 82.015044,68.65937 81.008301,68.039668 80.510299,67.733123 79.91236,66.669743 79.91236,66.669743 l -0.182655,-3.379153 4.201107,-3.470478 c 0,0 2.99233,-3.6514 4.018449,-5.75369 0.908121,-1.860538 1.452936,-3.900007 1.826567,-5.936348 0.170667,-0.930162 0.182658,-2.831182 0.182658,-2.831182 0,0 1.867417,-0.574401 2.739853,-1.004612 1.022201,-0.504063 2.283211,-1.643909 2.283211,-1.643909 0,0 1.090754,-0.174056 1.324259,-0.456644 0.754888,-0.913564 0.99243,-1.304017 1.232936,-2.28321 0.323216,-1.315935 0.295543,-2.765469 -0.09133,-4.064115 -0.230327,-0.773157 -0.831997,-1.976688 -1.278598,-2.648528 -1.77126,-2.664575 -3.009574,-5.025188 -5.551724,-7.236708 -0.559263,-0.486526 -2.627252,-1.735516 -3.816486,-2.30901 -1.018769,-0.49129 -3.143782,-1.276697 -3.143782,-1.276697 l -1.219559,-3.46494 -0.607008,-5.75923 c 0,0 0.174603,-2.477846 -0.01567,-3.6946045 C 81.48848,7.3712972 80.623617,5.4260117 79.541508,4.1263986 78.622914,3.0231685 77.382339,1.4398931 76.241655,1.3588462 c -0.3638,-0.025848 -0.804386,0.7417073 -0.804386,0.7417073 0,0 -1.115315,2.1368387 -1.369925,4.201107 -0.115585,0.9371165 -0.09133,2.8311808 -0.09133,2.8311808 L 70.124553,4.8625659 c 0,0 -2.331798,-2.2842141 -3.4871,-2.9335893 -0.615626,-0.3460322 -1.232482,-0.7747998 -1.88561,-0.6503788 -0.27571,0.052523 -0.59467,0.2708729 -0.639296,0.5479704 z"
                        id="rabbit_svg__background"
                        initial={{ fill: "#0000006" }}
                        animate={{ fill: "#00000075" }}
                        transition={{
                            duration: 6
                        }}
                    />
                    <motion.path
                        d="m 64.112547,1.8265682 c -0.63913,3.9685377 0.365313,10.7767528 0.365313,10.7767528 0,0 0.935898,4.401375 1.826566,6.205743 1.035463,2.097704 4.018452,5.301637 4.018452,5.301637 l 1.004613,2.465866 c 0,0 -0.601728,2.75039 -1.18727,4.018452 -0.350443,0.758927 -1.369926,2.100554 -1.369926,2.100554 l -3.835794,0.182655 c 0,0 -3.503343,-0.91233 -5.297048,-1.095941 -2.422764,-0.248005 -4.887865,-0.287388 -7.306273,0 -3.482765,0.41387 -6.972014,1.164174 -10.228781,2.465869 -2.938289,1.174403 -5.78315,2.729999 -8.219559,4.749077 -2.443276,2.02477 -4.77077,4.559353 -6.575645,7.16928 -1.518728,2.196147 -2.520414,4.436616 -3.561807,6.895294 -0.758584,1.790979 -1.351378,3.830809 -1.643912,5.753691 -0.233513,1.534922 -0.285401,4.623501 -0.285401,4.623501 0,0 -1.750342,-0.334213 -2.431619,-0.0685 -0.721978,0.281589 -1.200114,1.252261 -1.221519,1.917897 -0.04105,1.276547 0.156633,1.818421 0.559387,2.751268 0.567277,1.313906 1.573749,2.434163 2.648525,3.379153 0.984146,0.865304 2.15349,1.545491 3.379151,2.009224 1.072188,0.405666 3.37915,0.6393 3.37915,0.6393 l 2.557196,0.09133 c 0,0 1.656706,1.032646 2.509237,1.332099 2.166405,0.760953 6.623605,0.859783 6.623605,0.859783 l 5.023062,-0.09133 c 0,0 3.256114,0.07472 4.690037,-0.54797 0.475522,-0.206497 1.154981,-1.004613 1.154981,-1.004613 0,0 1.335772,0.357335 1.917899,0.09133 0.492987,-0.225272 0.881447,-0.750757 1.004612,-1.278596 0.134316,-0.57563 -0.365315,-1.735241 -0.365315,-1.735241 l 2.739853,-1.18727 c 0,0 2.368278,-1.046902 3.872672,-1.610672 1.567002,-0.673188 3.136425,-1.307051 4.803526,-1.677151 0,0 1.8339,2.598513 2.831181,3.835794 0.839292,1.041271 1.503663,2.10779 2.465868,3.036669 0.622579,0.601016 1.780903,1.643912 1.780903,1.643912 0,0 4.294764,0.271184 6.347326,0.159825 1.134952,-0.06158 2.299102,-0.102515 3.37915,-0.456641 0.362461,-0.118844 0.656501,-0.392019 1.004612,-0.547971 0.413013,-0.185028 0.945493,-0.150283 1.278599,-0.456642 0.270746,-0.249006 0.456642,-1.004612 0.456642,-1.004612 l 0.54797,-0.273987 1.82657,-0.54797 c 0,0 0.377125,-0.470208 0.456641,-0.730627 0.234877,-0.76923 -0.544983,-1.474808 -1.050279,-2.100554 C 85.52509,69.29583 84.996421,69.146081 84.341789,68.81596 83.286226,68.283655 82.015044,68.65937 81.008301,68.039668 80.510299,67.733123 79.91236,66.669743 79.91236,66.669743 l -0.182655,-3.379153 4.201107,-3.470478 c 0,0 2.99233,-3.6514 4.018449,-5.75369 0.908121,-1.860538 1.452936,-3.900007 1.826567,-5.936348 0.170667,-0.930162 0.182658,-2.831182 0.182658,-2.831182 0,0 1.867417,-0.574401 2.739853,-1.004612 1.022201,-0.504063 2.283211,-1.643909 2.283211,-1.643909 0,0 1.090754,-0.174056 1.324259,-0.456644 0.754888,-0.913564 0.99243,-1.304017 1.232936,-2.28321 0.323216,-1.315935 0.295543,-2.765469 -0.09133,-4.064115 -0.230327,-0.773157 -0.831997,-1.976688 -1.278598,-2.648528 -1.77126,-2.664575 -3.009574,-5.025188 -5.551724,-7.236708 -0.559263,-0.486526 -2.627252,-1.735516 -3.816486,-2.30901 -1.018769,-0.49129 -3.143782,-1.276697 -3.143782,-1.276697 l -1.219559,-3.46494 -0.607008,-5.75923 c 0,0 0.174603,-2.477846 -0.01567,-3.6946045 C 81.48848,7.3712972 80.623617,5.4260117 79.541508,4.1263986 78.622914,3.0231685 77.382339,1.4398931 76.241655,1.3588462 c -0.3638,-0.025848 -0.804386,0.7417073 -0.804386,0.7417073 0,0 -1.115315,2.1368387 -1.369925,4.201107 -0.115585,0.9371165 -0.09133,2.8311808 -0.09133,2.8311808 L 70.124553,4.8625659 c 0,0 -2.331798,-2.2842141 -3.4871,-2.9335893 -0.615626,-0.3460322 -1.232482,-0.7747998 -1.88561,-0.6503788 -0.27571,0.052523 -0.59467,0.2708729 -0.639296,0.5479704 z"
                        id="rabbit_svg__body"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1.1 }}
                        transition={{
                            duration: 5,
                        }}
                    />
                    {LINE_PATHS.map((d, i) => (
                        <motion.path
                            d={d}
                            className="rabbit_svg__line"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1.1 }}
                            transition={{
                                duration: 3,
                                delay: 2
                            }}
                            key={i}
                        />
                    ))}
                </g>
            </SvgRabbit>
        </SvgRabbitGlobal>
    )
}
export default RabbitSvg;

export const SvgRabbitGlobal = styled.div`
    position: absolute;
    height: 100%;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`
const SvgRabbit = styled.svg`
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

    & path {
        stroke-width: 0.264583;
        stroke: #fff;
    }
    & #rabbit_svg__body {
        fill: transparent;
    }
    & .rabbit_svg__line {
        fill: transparent;
    }
`