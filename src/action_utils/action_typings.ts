export interface Action<TPayload> {
    type: string;
    payload: TPayload;
}

export interface ActionCreator<TPayload> {
    type: string;
    (payload?:TPayload): Action<TPayload>;
}



const actionTypes:Set<string> = new Set<string>();

export function actionCreatorFactory<TPayload>(type:string):ActionCreator<TPayload> {

    if (actionTypes.has(type))
        throw new Error(`Duplicate action type: ${type}`);
    actionTypes.add(type);

    return Object.assign(
        (payload:TPayload):any => ({type, payload}),
        {type}
    );
}

export function isAction<TPayload>(
    action:Action<any>,
    actionCreator:ActionCreator<TPayload>
):action is Action<TPayload> {

    if (!actionCreator)
        return false;

    return action.type === actionCreator.type;
}