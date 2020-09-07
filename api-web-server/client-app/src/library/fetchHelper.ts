import { PatientSearchTemplateVM, PatientVM, PatientDTM } from "./patient";
import * as Actions from '../store/actions';
import { Status } from '../library/history';

export function fetchPatientTemplate(
    onRecieve: (serializedData: string) => void,
    badResponseHandler: (response: Response) => void,
    responseParceHandler: (error: any) => void) {
    myFetch(
        'patient_fields/template',
        'GET',
        undefined,
        onRecieve,
        badResponseHandler,
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
        response => delayedStoreDispatch(Actions.notifyBadResponse(response)),
        error => delayedStoreDispatch(Actions.notifyResponseProcessingError(error)));
}

export function fetchVariants(fieldNameId: number,
    patientTemplate: PatientSearchTemplateVM,
    delayedStoreDispatch: (action: Actions.MyAction) => void
) {
    myFetch(
        `patient_fields/variants?fieldNameId=${fieldNameId}&maxCount=${5}`,
        'POST',
        JSON.stringify(patientTemplate),
        serializedData => {
            const variants = JSON.parse(serializedData) as string[];
            if (delayedStoreDispatch) {
                delayedStoreDispatch(Actions.giveVariants(fieldNameId, variants));
            }
        },
        response => delayedStoreDispatch(Actions.notifyBadResponse(response)),
        error => delayedStoreDispatch(Actions.notifyResponseProcessingError(error)));
}

export function fetchSyncPatient(
    myThen: (serializedData: string) => void,
    patient: PatientVM,
    status: Status,
    badResponseHandler: (response: Response) => void,
    responseParceHandler: (error: any) => void) {
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
        badResponseHandler,
        responseParceHandler
    );
}

function myFetch(
    url: string,
    method: string | undefined = 'GET',
    body: string | undefined = undefined,
    myThen: (value: string) => void | null,
    badResponseHandler: (response: Response) => void,
    responseParceHandler: (error: any) => void,
) {
    fetch(url, { method, body })
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
                badResponseHandler(response);
                return null;
            } else {
                return response.text();
            }
        })
        .then(text => {
            if (text === null) return;
            try {
                myThen(text);
            } catch (error) {
                responseParceHandler(error);
            }
        });
}