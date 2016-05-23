/**
 * Created by sm on 14/05/16.
 */

import { Map } from 'immutable';
import { expect } from 'chai';
import { Store as StoreClass } from '../src/store';

const EXPECTING_ERROR = new Error('An exception was expected here');

describe('Metadatio store', () => {
    let Store = null;

    beforeEach(() => {
        Store = new StoreClass();
    });

    describe('upon creation', () => {
        it('should expose basic parameters', () => {
            expect(Store.configured).to.equal(false);
            expect(Store.store).to.equal(null);
            expect(Store.asyncReducers).to.deep.equal({});
        });

        it('should not allow to dispatch actions', (done) => {
            try {
                Store.dispatch({});
                done(EXPECTING_ERROR);
            } catch(e) {
                expect(e.className).to.equal('StoreException');
                expect(e.code).to.equal('ST001');
                done();
            }
        });

        it('should not allow reducer injection', (done) => {
            try {
                Store.injectAsync('name', {});
                done(EXPECTING_ERROR);
            } catch(e) {
                expect(e.className).to.equal('StoreException');
                expect(e.code).to.equal('ST002');
                done();
            }
        });

        it('should not allow to fetch state', (done) => {
            try {
                Store.getState();
                done(EXPECTING_ERROR);
            } catch(e) {
                expect(e.className).to.equal('StoreException');
                expect(e.code).to.equal('ST003');
                done();
            }
        });
    });

    describe('upon configuration', () => {
        it('should change its state to \'configured\'', () => {
            Store.configure();
            expect(Store.configured).to.equal(true);

            console.log(Store.getState());
        });

        it('should not allow a second configuration attempt', (done) => {
            try {
                Store.configure();
                Store.configure();
                done(EXPECTING_ERROR)
            } catch(e) {
                expect(e.className).to.equal('StoreException');
                expect(e.code).to.equal('STC001');
                done();
            }
        });

        describe('the initial state', () => {
            it('should not be a non-Map instance', (done) => {
                try {
                    Store.configure({});
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STS001');
                    done();
                }
            });

            it('should be fetchable', () => {
                Store.configure();
                expect(Store.getState()).to.not.equal();
            });
        });

        describe('the \'actual\' store', () => {
            beforeEach(() => {
                Store.configure();
            });

            it('should be initialized', () => {
                expect(Store.store).to.not.equal(null);
            });

            it('should expose basic methods', () => {
                expect(typeof Store.store.dispatch).to.equal('function');
                expect(typeof Store.store.getState).to.equal('function');
            });
        });

        describe('the store wrapper', () => {
            beforeEach(() => {
                Store.configure();
            });

            it('should dispatch store actions', () => {
                let actionSent = null
                Store.store.dispatch = (action) => {
                    actionSent = action;
                };

                const action = {
                    type: 'action'
                };

                Store.dispatch(action);
                expect(actionSent).to.deep.equal(action);
            });

            it('should fetch store\'s state', () => {
                Store.store.getState = (action) => {
                    return 'real-state';
                };

                const state = Store.getState();
                expect(state).to.equal('real-state');
            });
        });

        describe('the action dispatcher', () => {
            beforeEach(() => {
                Store.configure();
            });

            it('should only accept objects', (done) => {
                try {
                    Store.dispatch('wrong');
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STD001');
                    done();
                }
            });

            it('should receive objects that have a \'type\' attribute', (done) => {
                try {
                    Store.dispatch({});
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STD002');
                    done();
                }
            });

            it('should receive objects whose \'type\' attribute is a string', (done) => {
                try {
                    Store.dispatch({ type: 123 });
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STD003');
                    done();
                }
            })
        });

        describe('the reducer async injection', () => {
            it('should receive a name for the reducer', (done) => {
                try {
                    Store.configure();
                    Store.injectAsync();
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STI001');
                    done();
                }
            });

            it('should only accept strings for the reducer name', (done) => {
                try {
                    Store.configure();
                    Store.injectAsync(123);
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STI002');
                    done();
                }
            });

            it('should receive a reducer to inject', (done) => {
                try {
                    Store.configure();
                    Store.injectAsync('reducer');
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STI003');
                    done();
                }
            });

            it('should receive a function as reducer', (done) => {
                try {
                    Store.configure();
                    Store.injectAsync('reducer', {});
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STI004');
                    done();
                }
            });

            it('should not allow two reducers with the same name', (done) => {
                try {
                    Store.configure();
                    Store.injectAsync('reducer', () => Store.getState());
                    Store.injectAsync('reducer', () => Store.getState());
                    done(EXPECTING_ERROR);
                } catch(e) {
                    expect(e.className).to.equal('StoreException');
                    expect(e.code).to.equal('STI005');
                    done();
                }
            });
        });
    });

});