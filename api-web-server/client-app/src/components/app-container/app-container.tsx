import React from 'react'
import { connect } from 'react-redux'

export type Action = { type: string, data: string };
type LabelProps = {
    add: () => Action,
    edit: () => Action,
    remove: () => Action,
    text: string
}

const Label = (props: LabelProps) => {
    return (
        <div>
            <h1>{props.text}</h1> 
            <button onClick={props.add}>+</button>
            <button onClick={props.edit}>/</button>
            <button onClick={props.remove}>-</button>
        </div>
    );
}

const mapStateToProps = (state: any): LabelProps => {
    return {
        add,
        edit,
        remove,
        text: `data is ${state.red.data}`,
    }
};

const add = (): Action => {
    console.log("dispatch: add");
    return { type: 'ADD', data: '1' }
};
const edit = (): Action => {
    console.log("dispatch: edit");
    return { type: 'EDIT', data: '2' };
}
const remove = (): Action => {
    console.log("dispatch: remove");
    return { type: 'REMOVE', data: '3' }
};
const mapDispatchToProps = {
    add, edit, remove
}

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Label);