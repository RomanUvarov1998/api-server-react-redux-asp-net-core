import React from "react";

type RawCellProps = {
    labelText: string,
    onChange: (v: string) => void,
    value: string,
    disabled: boolean,
    autofocus: boolean
}

export function FieldEditor(props: RawCellProps): JSX.Element {
    return (
        <label
            style={{ display: 'block', color: props.disabled ? 'gray' : 'black' }}
        >
            {props.labelText}
            <input
                type={"text"}
                value={props.value}
                onChange={e => props.onChange(e.currentTarget.value)}
                disabled={props.disabled}
                autoFocus={props.autofocus}
                style={{ display: 'block' }}
            />
        </label>
    );
}