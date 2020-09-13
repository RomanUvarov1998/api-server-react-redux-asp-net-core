import { PatientSearchTemplateVM, PatientVM, PatientDTM } from "./patient";
import * as Actions from '../store/actions';
import { Status } from '../library/history';

export function fetchPatientTemplate(
    onRecieve: (serializedData: string) => void,
    notOkResponseHandler: (response: Response, msg: string) => void,
    responseParceHandler: (error: any) => void) {
    myFetch(
        'field_names/template',
        'GET',
        undefined,
        onRecieve,
        notOkResponseHandler,
        responseParceHandler
    );
}

export function fetchUpdatedPatientTemplate(
    updatedTemplate: PatientSearchTemplateVM,
    onRecieve: (serializedData: string) => void,
    notOkResponseHandler: (response: Response, msg: string) => void,
    responseParceHandler: (error: any) => void) {
    myFetch(
        'field_names/template',
        'POST',
        JSON.stringify(updatedTemplate),
        onRecieve,
        notOkResponseHandler,
        responseParceHandler
    );
}

export function fetchPatientsList(
    currentTemplate: PatientSearchTemplateVM, currentListLength: number,
    currentLoadCount: number,
    delayedStoreDispatch: (action: Actions.MyAction) => void
) {
    myFetch(
        `patients/list?skip=${currentListLength}&take=${currentLoadCount}`,
        'POST',
        JSON.stringify(currentTemplate),
        (serializedData: string) => {
            const data = JSON.parse(serializedData) as PatientVM[];
            const append = currentListLength > 0;
            const patients = data.map(el => PatientVM.from(el));
            if (delayedStoreDispatch) {
                delayedStoreDispatch(Actions.recievePatients(patients, append));
            }
        },
        (response, msg) => delayedStoreDispatch(Actions.notifyBadResponse(response, msg)),
        error => delayedStoreDispatch(Actions.notifyResponseProcessingError(error)));
}

export function fetchVariants(fieldNameId: number,
    patientTemplate: PatientSearchTemplateVM,
    delayedStoreDispatch: (action: Actions.MyAction) => void
) {
    myFetch(
        `field_names/variants?fieldNameId=${fieldNameId}&maxCount=${5}`,
        'POST',
        JSON.stringify(patientTemplate),
        serializedData => {
            const variants = JSON.parse(serializedData) as string[];
            if (delayedStoreDispatch) {
                delayedStoreDispatch(Actions.giveVariants(fieldNameId, variants));
            }
        },
        (response, msg)=> delayedStoreDispatch(Actions.notifyBadResponse(response, msg)),
        error => delayedStoreDispatch(Actions.notifyResponseProcessingError(error)));
}

export function fetchSyncPatient(
    myThen: (serializedData: string) => void,
    patient: PatientVM,
    status: Status,
    notOkResponseHandler: (response: Response, msg: string) => void,
    responseParceHandler: (error: any) => void) 
{
    const patientCopy = patient.copy();

    if (status === Status.Untouched) throw new Error('status cant be untouched');

    let action;
    switch (status) {
        case Status.Added: action = 'add'; break;
        case Status.Modified: action = 'update'; break;
        case Status.Deleted: action = 'delete'; break;
        default: throw new Error(`unknown action ${action} on patient ${patientCopy}`);
    }

    myFetch(
        `patients/${action}`,
        'POST',
        JSON.stringify(PatientDTM.from(patientCopy)),
        myThen,
        notOkResponseHandler,
        responseParceHandler
    );
}

function myFetch(
    url: string,
    method: 'GET' | 'POST',
    body: string | undefined,
    myThen: (value: string) => void | null,
    notOkResponseHandler: (response: Response, msg: string) => void,
    responseParceHandler: (error: any) => void,
) {
    let isOk = true;
    let notOkResponse: Response;
    fetch(url, { method, body })
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
                isOk = false;
                notOkResponse = response.clone();
                return response.text();
            } else {
                return response.text();
            }
        })
        .then(text => {
            if (text === null) return;
            if (!isOk) {
                notOkResponseHandler(notOkResponse, text);
                return;
            }
            try {
                myThen(text);
            } catch (error) {
                responseParceHandler(error);
            }
        });
}