

import { cn } from "../../lib/cn";
import ShiningRectangle from "../icons/ShiningRectangle";
import "./index.css"


export enum OrbStatusEnum {
    takingInput = 'takingInput',
    thinking = 'thinking',
    responding = 'responding',
    impatient = 'impatient',
}


interface IProps {
    color: string;
    state: OrbStatusEnum;
}


const Orb = ({ color, state }: IProps) => {
    return (
        <div className={cn("h-12 w-12 flex justify-center  rounded-custom-56 shining p-1", {
            "animate-taking-input orb-container": state === OrbStatusEnum.takingInput,
            "animate-thinking orb-container": state === OrbStatusEnum.thinking,
            "animate-impatient": state === OrbStatusEnum.impatient,
        })} style={{ "--input-color": color } as React.CSSProperties}>
            <ShiningRectangle width="33" height="17" />
        </div>
    )
}

export default Orb;