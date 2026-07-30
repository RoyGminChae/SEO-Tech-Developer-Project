import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

function SavedPlans(){
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        async function loadPlans(){
            try {
                const response = await fetch("http://localhost:8000/plans");
                const data = await response.json();

                setPlans(data);
            }   catch(error) {
                console.error("Error loading plans;", error);
            }
        }
        loadPlans();
    }, []);

    async function deletePlan(id){
        try{
            const response = await fetch(
                `http://localhost:8000/plans/${id}`,
            {
                method: "DELETE",
            }
        );
        if (!response.ok){
            throw new Error("Failed to delete");
        }

            setPlans(plans.filter(plan => plan.id !== id));
        } catch (error){
            console.error(error);
        }
    }

    return(
        <>
        <main className="app plans-page">
            <header className="app-header">
                <h1>Saved Study Plans</h1>
                <p>Review the plans you have created</p>
            </header>

            <section className='saved-plans-list'>
                {plans.length === 0? (
                    <div className='empty-plans'>
                        <h2>No saved plans yet</h2>
                        <p>Create a study plan on the home page, then save it here</p>
                    </div>
                ) :
                (
                    plans.map((plan) => (
                        <article className = "saved-plan-card"
                        key={plan.id}>
                        <p className="saved-date">
                            Saved at
                            {"  "}
                            {new Date(plan.createdAt).toLocaleString()}
                        </p>
                        <div className='study-plan-text'>
                            {plan.plan.split("\n").map((line,index)=> (
                                line.trim() !== "" && <p key={index}>{line}</p>
                            ))}
                        </div>

                            <button className='primary-button'
                            onClick={() => deletePlan(plan.id)}>
                            Delete
                            </button>
                        </article>
                    ))
                )}

            </section>

            <Link className="back-link" to="/">
                Back to Search
            </Link>
        </main>
        </>

    )
}
export default SavedPlans;