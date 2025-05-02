import { RegistrationForm } from '../components/registration-form'

const RegistrationPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full">
                <RegistrationForm />
            </div>
        </div>
    )
}

export default RegistrationPage
