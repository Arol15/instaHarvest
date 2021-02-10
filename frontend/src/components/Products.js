import React from 'react'

export default function Products({products}) {
    return (
        <div>
            {products.map(product => {
                return (
                    <li>{product.name}</li>
                )
            })}
        </div>
    )
}

