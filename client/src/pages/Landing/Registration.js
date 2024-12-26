import { Tick01Icon } from 'hugeicons-react';
import React from 'react';

const Registration = () => {
    return (
        <div className=" py-5">
            <div className="container">
                <div className="flex flex-wrap items-center">
                    <div className="w-full lg:w-7/12 mb-5 lg:mb-0">
                        <p className="text-primary pr-5">
                            <span className="pr-2">Book A Seat</span>
                        </p>
                        <h1 className="mb-4">Book A Seat For Your Kid</h1>
                        <p>
                            Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo dolor lorem ipsum ut sed
                            eos, ipsum et dolor kasd sit ea justo. Erat justo sed sed diam. Ea et erat ut sed diam sea
                            ipsum est dolor
                        </p>
                        <ul className="list-none m-0">
                            <li className="py-2 flex items-center">
                                <Tick01Icon className="size-4 text-green-700 mr-2" />
                                Labore eos amet dolor amet diam
                            </li>
                            <li className="py-2 flex items-center">
                                <Tick01Icon className="size-4 text-green-700 mr-2" />
                                Etsea et sit dolor amet ipsum
                            </li>
                            <li className="py-2 flex items-center">
                                <Tick01Icon className="size-4 text-green-700 mr-2" />
                                Diam dolor diam elitripsum vero.
                            </li>
                        </ul>
                        <div className="flex justify-center">
                            <button
                                className="bg-primary rounded-3xl px-5 text-white  border-0 py-3 hover:bg-secondary"
                                type="submit"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-5/12 rounded-3xl">
                        <div className="card border-0">
                            <div className="card-header bg-secondary text-center p-4">
                                <h1 className="text-white m-0">Book A Seat</h1>
                            </div>
                            <div className="card-body rounded-b bg-primary p-5">
                                <form>
                                    <div className="form-group mb-4">
                                        <input
                                            type="text"
                                            className="form-control border-0 p-4 w-full rounded-md outline-none"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <input
                                            type="email"
                                            className="form-control border-0 p-4  w-full rounded-md outline-none"
                                            placeholder="Your Email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <select
                                            className="custom-select border-0 px-4 h-12 w-full rounded-md outline-none"
                                            required
                                        >
                                            <option selected>Select A Class</option>
                                            <option value="1">Class 1</option>
                                            <option value="2">Class 2</option>
                                            <option value="3">Class 3</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            className="bg-secondary rounded-3xl px-5 text-white  border-0 py-3 hover:bg-slate-700"
                                            type="submit"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
