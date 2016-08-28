import * as React from "react";

export interface HeaderComponentProps {
    heading:string,
    subHeading?: string
}

function headerComponent(props: HeaderComponentProps) {
    const subHeading = props.subHeading ? <small>{props.subHeading}</small> : undefined;

    if(1 === 2) {
        return (
            <div className="page-header">
                <h1>{props.heading} {subHeading}</h1>
            </div>
        );
    }

    return null;
}

export const HeaderComponent = headerComponent;