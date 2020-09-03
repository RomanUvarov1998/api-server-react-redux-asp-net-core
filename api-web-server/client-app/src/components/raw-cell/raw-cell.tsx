import React from "react"

export type RawCellProps = {
    setEntityValue: (v: string) => void,
    value: string,
    disabled: boolean
}

export function RawCell(props: RawCellProps) {
    return (
        <td>
            <input
                type={"text"}
                value={props.value}
                onChange={(e) => onChange(e, props)}
                disabled={props.disabled}
            />
        </td>
    );
}

function onChange(e: React.FormEvent<HTMLInputElement>, props: RawCellProps) {
    props.setEntityValue(e.currentTarget.value);
}