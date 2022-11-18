import React from 'react';
import { Link } from 'react-router-dom';

function Pagination({ numberPerPage, totalNumber, paginate }) {

    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalNumber / numberPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                {
                    pageNumbers.map(number => (
                        <li key={number} className="page-item">
                            <Link to='#'>
                                <span className="page-link" onClick={() => paginate(number)}>{number}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}

export default Pagination;
