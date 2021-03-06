/**
 * Created by sm on 28/05/16.
 */

import BaseException from './base.exception';

export default class MetadatioException extends BaseException {
    constructor(code) {
        super(code, MetadatioException.codes[code], { className: 'MetadatioException' });
    }

    static codes = {
        'MC001': 'Metadatio core needs a store to init',
        'MC002': 'Metadatio core\'s input needs to be an instance of Store',

        'MS001': 'For scaffolding an item an Entity is needed',
        'MS002': 'The entity for scaffolding needs to be an instance of Entity',
        'MS003': 'For scaffolding with a data object, you need an Object',

        'MI001': 'Metadatio importing needs to receive an object',
        'MI002': 'Metadatio importing input needs to be an Object',

        'MO001': 'Metadatio action injection needs an action object to match',
        'MO002': 'Action describers for Metadatio action injection need to be objects',
        'MO003': 'Metadatio action injection needs an action to trigger',
        'MO004': 'Action to trigger on action injection needs to be a function'
    }
}