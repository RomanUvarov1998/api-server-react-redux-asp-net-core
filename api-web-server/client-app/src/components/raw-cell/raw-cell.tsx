import React from "react"

export type RawCellProps = {
    setEntityValue: (v: string) => void,
    value: string,
    isEditing: boolean
}

export function RawCell(props: RawCellProps) {
    if (props.isEditing) {
        return (
            <td>
                <input
                    type={"text"}
                    value={props.value}
                    onChange={(e) => onChange(e, props)}
                />
            </td>
        );
    } else {
        return (<td>{props.value}</td>);
    }
}

function onChange(e: React.FormEvent<HTMLInputElement>, props: RawCellProps) {
    props.setEntityValue(e.currentTarget.value);
}