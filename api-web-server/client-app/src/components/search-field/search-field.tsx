import * as React from "react"
import { FieldValue } from "../../library/patient";

export type SearchFieldProps = {
    frozen: boolean,
    value: FieldValue,
    onInput: (newValue: FieldValue) => void
}

export function SearchField(props: SearchFieldProps) {
    return (
        <td>
            <input
                value={props.value}
                onChange={(e) => onChange(e, props)}
                disabled={props.frozen}
            />
        </td>
    );
}

function onChange(e: React.FormEvent<HTMLInputElement>, props: SearchFieldProps) {
    props.onInput(e.currentTarget.value);
}