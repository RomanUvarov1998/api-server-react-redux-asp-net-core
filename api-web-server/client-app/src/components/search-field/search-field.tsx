import React, { useState } from 'react'
import { FieldValue, PatientSearchTemplateFieldVM } from '../../library/patient';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export type SearchFieldProps = {
    frozen: boolean,
    field: PatientSearchTemplateFieldVM,
    onInput: (newValue: FieldValue) => void
}

export function SearchField(props: SearchFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    const items =
        props.field.variants.length ?
            props.field.variants
                .map((v, ind) => (
                    <DropdownItem
                        key={ind}
                        onClick={() => {
                            props.onInput(v);
                            setIsOpen(false);
                        }}
                    >{v}</DropdownItem>
                )) :
            (<DropdownItem header>Не найдено</DropdownItem>);

    const id = `searchField${props.field.nameId}`;

    return (
        <td>
            <Dropdown
                isOpen={isOpen}
                toggle={() => {
                    setIsOpen(true);
                    props.onInput(props.field.value);
                }}
            >
                <DropdownToggle
                    caret={true}
                >
                    <label htmlFor={id} style={{ display: 'block' }}>{props.field.name}</label>
                    <input
                        id={id}
                        value={props.field.value}
                        onChange={e => {
                            setIsOpen(true);
                            props.onInput(e.currentTarget.value);
                        }}
                        disabled={props.frozen}
                        onBlur={() => setIsOpen(false)}
                    />
                </DropdownToggle>
                <DropdownMenu>
                    {items}
                </DropdownMenu>
            </Dropdown>
        </td>
    );
}