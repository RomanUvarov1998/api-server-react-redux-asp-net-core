import React from 'react';
import { Patient, toPatient } from '../../library/patient'
import { myFetch } from '../../library/fetchHelper';
import { SearchBar } from '../search-bar/search-bar';
import { Button } from 'reactstrap';

type SearchTableProps = {
    addToEditingList: (patient: Patient) => void
}
type SearchTableState = {
    isWaitingPatientsList: boolean,
    isWaitingPatientFields: boolean,
    patientsList: Patient[],
    patientTemplate: Patient | null,
    canLoadMore: boolean,
    loadCount: number
}

export class SearchTable extends React.Component<SearchTableProps, SearchTableState, {}> {
    constructor(props: SearchTableProps) {
        super(props);

        this.state = {
            isWaitingPatientsList: true,
            isWaitingPatientFields: true,
            patientsList: [],
            patientTemplate: null,
            canLoadMore: true,
            loadCount: 10
        };
    }

    render() {
        let tableHeadRow;
        let tableBodyRows;
        let searchBar;

        if (!this.state.isWaitingPatientFields) {
            if (!this.state.patientTemplate) throw Error("patientTemplate is null");

            tableHeadRow = (
                <tr>
                    {this.state.patientTemplate.fields.map(f => (<th key={f.nameId}>{f.name}</th>))}
                </tr>
            );
            searchBar = (
                <SearchBar
                    frozen={false}
                    patientTemplate={this.state.patientTemplate}
                    onSetSearchTemplate={this.onSetSearchTemplate}
                    onClearTemplate={this.onClearTemplate}
                />
            );
        } else {
            tableHeadRow = (<tr><th>Загрузка полей пациента...</th></tr>);
            searchBar = (<p>Загрузка полей пациента...</p>);
        }

        if (!this.state.isWaitingPatientsList) {
            if (!this.state.patientTemplate) throw Error("patientTemplate is null");

            tableBodyRows =
                this.state.patientsList.length > 0 ?
                    (
                        this.state.patientsList.map(p => {
                            const cells = p.fields
                                .map(f => (<td key={f.nameId}>{f.value}</td>))
                                .concat(
                                    <td key={'edit'}>
                                        <Button
                                            onClick={() => this.props.addToEditingList(p)}
                                        >Редактировать</Button>
                                    </td>
                                );
                            return (<tr key={p.id}>{cells}</tr>)
                        })
                    ) :
                    (<tr><td>Список пуст</td></tr>);
        } else {
            let pt = this.state.patientTemplate;
            tableBodyRows = (<tr><td colSpan={pt ? pt.fields.length : 1}>Загрузка списка пациентов...</td></tr>);
        }

        return (
            <>
                {searchBar}
                <div
                    style={{ maxHeight: 300, overflowY: 'auto', margin: 10 }}
                    onScroll={this.handleScroll}
                >
                    <table className={"table table-responsive table-striped table-bordered table-normal"}>
                        <thead className={"thead-dark"}>
                            {tableHeadRow}
                        </thead>
                        <tbody>
                            {tableBodyRows}
                        </tbody>
                    </table>
                </div>
                {
                    this.state.canLoadMore ?
                        (<Button onClick={this.onLoadMore}>Загрузить ещё</Button>) :
                        (<strong>Загружены все найденные результаты</strong>)
                }
            </>
        );
    }

    componentDidMount() {
        this.loadPatientFields();
    }

    state: SearchTableState;

    private handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrolledHeight = (e.currentTarget as any).scrollTop + (e.currentTarget as any).clientHeight;
        // if (scrolledHeight > this.loadedHeight) {
        //     this.loadedHeight = scrolledHeight;
        //     //console.log(`loaded to ${this.loadedHeight}`);
        // }
        //console.log(e.currentTarget);
    }

    private loadPatientFields = () => {
        myFetch(
            'patients/template',
            'GET',
            undefined,
            (value: string) => {
                let parsedModel = JSON.parse(value) as Patient;
                let patientTemplate = toPatient(parsedModel);

                this.setState({
                    patientTemplate,
                    isWaitingPatientFields: false
                })
                this.loadPatients(patientTemplate, 0, this.state.loadCount);
            }
        );
    }

    private onSetSearchTemplate = (fieldNameId: number, newValue: string) => {
        if (!this.state.patientTemplate) return;

        let patientTemplate = this.state.patientTemplate
            .updateField(fieldNameId, newValue);

        console.log(`search ${patientTemplate.toString()}`);

        this.setState({
            patientTemplate,
            patientsList: [],
            isWaitingPatientsList: true,
            canLoadMore: true
        });

        this.loadPatients(patientTemplate, 0, this.state.loadCount);
    }

    private onClearTemplate = () => {
        if (!this.state.patientTemplate) return;

        let patientTemplate = this.state.patientTemplate.copy();
        patientTemplate.fields.forEach(f => f.value = '');

        console.log(`search ${patientTemplate.toString()}`);

        this.setState({
            patientTemplate,
            patientsList: [],
            isWaitingPatientsList: true,
            canLoadMore: true
        });

        this.loadPatients(patientTemplate, 0, this.state.loadCount);
    }

    private onLoadMore = () => {
        if (!this.state.patientTemplate) return;

        let patientTemplate = this.state.patientTemplate.copy();

        console.log(`search more ${patientTemplate.toString()}`);

        this.loadPatients(patientTemplate, this.state.patientsList.length, this.state.loadCount);
    }

    private loadPatients = (currentTemplate: Patient, currentListLength: number,
        currentLoadCount: number) => {
        myFetch(
            `patients/list?skip=${currentListLength}&take=${currentLoadCount}`,
            'POST',
            JSON.stringify(currentTemplate),
            (value: string) => {
                let data = JSON.parse(value) as Patient[];
                let patientsList = this.state.patientsList.concat(
                    data.map(el => toPatient(el))
                );
                let canLoadMore = data.length === this.state.loadCount;
                this.setState({
                    patientsList,
                    isWaitingPatientsList: false,
                    canLoadMore
                });
            });
    }
}