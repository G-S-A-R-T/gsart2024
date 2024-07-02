import React, { useContext, useState, useEffect } from 'react';
import factorContext from '../context/factors/factorContext';

const AddFactor = (props) => {
    const context = useContext(factorContext);
    const { addFactor } = context;
    const initialFactorState = {
        datalayer: '',
        noofclasses: 0,
        classes: [],
        classpixel: [],
        floodpixel: []
    };

    const [factor, setFactor] = useState(initialFactorState);
    const [showForm, setShowForm] = useState(true);
    const [showMessage, setShowMessage] = useState(false);


    const handleInputChange = (index, field, value) => {
        const updatedClasses = [...factor.classes];
        updatedClasses[index] = {
            ...updatedClasses[index],
            [field]: value
        };


        if (field === 'min') {
            const enteredMin = parseFloat(value);
            const existingMax = parseFloat(updatedClasses[index].max);

            // Only update max if enteredMin is valid and is less than existingMax
            if (!isNaN(enteredMin) && (isNaN(existingMax) || enteredMin > existingMax)) {
                updatedClasses[index].max = ''; // Clear invalid max value
            }
        }

        setFactor(prevState => ({
            ...prevState,
            classes: updatedClasses
        }));
    };

    const handleNoofclassesChange = (e) => {
        let noofclasses = parseInt(e.target.value) || 0;

        // Limit the value of noofclasses to a maximum of 50
        if (noofclasses > 50) {
            noofclasses = 50;
        }


        if (noofclasses >= 0) {
            setFactor(prevState => ({
                ...prevState,
                noofclasses,
                // Retain the existing datalayer value from the previous state
                classes: Array.from({ length: noofclasses }, () => ({ min: '', max: '' })),
                classpixel: Array.from({ length: noofclasses }, () => ''),
                floodpixel: Array.from({ length: noofclasses }, () => ''),
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        props.showProgress(10)
        try {
            props.showProgress(30)
            await addFactor(factor.datalayer, factor.noofclasses, factor.classes, factor.classpixel, factor.floodpixel);
            props.showProgress(70)
            props.showAlert('Factor added successfully', 'success');
            setFactor(initialFactorState);
            setShowForm(false);
            setShowMessage(true);
        } catch (error) {
            console.error('Error submitting factor:', error);
            props.showAlert('Failed to add factor', 'danger');
        }
        props.showProgress(100)
    };

    const handleNext = () => {
        setShowForm(true);
        setShowMessage(false);

    };
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        const isFormValid = () => {
            if (factor.datalayer.trim().length < 3) {
                return false;
            }

            if (factor.noofclasses <= 0 || factor.noofclasses > 50) {
                return false;
            }

            for (const cls of factor.classes) {
                if (cls.min === undefined || cls.min === '' || cls.max === undefined || cls.max === '' || parseFloat(cls.min) >= parseFloat(cls.max)) {
                    return false;
                }
            }
    
            for (const pixel of factor.classpixel.concat(factor.floodpixel)) {
                if (pixel === undefined || pixel === '') {
                    return false;
                }
            }
    

            return true;
        };

        setFormValid(isFormValid());
    }, [factor]);


    return (
        <>
            <div className='container bg-body-tertiary border border-top-0 text-dark px-5 py-3 mb-3'>
                <h1 className="text-center text-success-900 mb-3">Frequency Ratio</h1>
                {showForm && (
                    <form onSubmit={handleSubmit} className="row g-3" >
                        <div className="mb-3 col-12">
                            <label htmlFor="datalayer" className="form-label">Enter Data Layer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="datalayer"
                                name="datalayer"
                                value={factor.datalayer}
                                onChange={(e) => setFactor({ ...factor, datalayer: e.target.value })}
                                minLength={3}
                                required
                            />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="noofclasses" className="form-label">Enter No. of Classes</label>
                            <input
                                type="number"
                                className="form-control "
                                id="noofclasses"
                                name="noofclasses"
                                value={factor.noofclasses}
                                onChange={handleNoofclassesChange}
                                max={50}
                                required
                            />
                        </div>
                        {[...Array(factor.noofclasses)].map((_, index) => (
                            <div key={index} className="row g-3 align-items-center">
                                <div className="col-auto">
                                    <label htmlFor={`min-${index}`} className="col-form-label">Class range {index + 1}: </label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        step="any"
                                        className="form-control"
                                        id={`min-${index}`}
                                        placeholder="Min"
                                        value={factor.classes[index]?.min !== undefined ? factor.classes[index].min : ''}
                                        onChange={(e) => handleInputChange(index, 'min', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-auto">
                                    <label htmlFor={`min-${index}`} className="col-form-label">to</label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        step="any"
                                        className="form-control"
                                        id={`max-${index}`}
                                        placeholder="Max"
                                        value={factor.classes[index]?.max !== undefined ? factor.classes[index].max : ''}
                                        onChange={(e) => handleInputChange(index, 'max', parseFloat(e.target.value))}
                                        min={factor.classes[index]?.min || undefined}
                                        required
                                    />
                                </div>
                                <div className="col-auto">
                                    <label htmlFor={`classpixel-${index}`} className="col-form-label">Class Pixel {index + 1}: </label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`classpixel-${index}`}
                                        placeholder="Class Pixel"
                                        value={factor.classpixel[index] !== undefined ? factor.classpixel[index] : ''}
                                        onChange={(e) => {
                                            const updatedClassPixel = e.target.value !== '' ? parseInt(e.target.value) : '';
                                            setFactor(prevState => ({
                                                ...prevState,
                                                classpixel: [
                                                    ...prevState.classpixel.slice(0, index),
                                                    updatedClassPixel,
                                                    ...prevState.classpixel.slice(index + 1)
                                                ]
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="col-auto">
                                    <label htmlFor={`floodpixel-${index}`} className="col-form-label">Flood Pixel {index + 1}: </label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`floodpixel-${index}`}
                                        placeholder="Flood Pixel"
                                        value={factor.floodpixel[index] !== undefined ? factor.floodpixel[index] : ''}
                                        onChange={(e) => {
                                            const updatedFloodPixel = e.target.value !== '' ? parseInt(e.target.value) : '';
                                            setFactor(prevState => ({
                                                ...prevState,
                                                floodpixel: [
                                                    ...prevState.floodpixel.slice(0, index),
                                                    updatedFloodPixel,
                                                    ...prevState.floodpixel.slice(index + 1)
                                                ]
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="col-12 ">
                            <button type="submit" className="btn btn-primary active" disabled={!formValid}>
                                Submit</button>
                        </div>
                    </form>
                )}

                {showMessage && (
                    <div>
                        <p>Do you want to continue?</p>
                        <button onClick={handleNext}>Next</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddFactor;
