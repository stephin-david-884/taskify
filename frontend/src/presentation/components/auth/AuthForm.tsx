import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

import {
    loginSchema,
    registerSchema,
} from "../../../lib/validation/authValidation";

interface AuthFormProps {
    mode: "login" | "signup";
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "LEAD" | "MEMBER";
    teamName: string;
    leadId: string;
}

const AuthForm = ({ mode }: AuthFormProps) => {
    const navigate = useNavigate();

    const {
        register,
        login,
        fetchLeads,
        loading,
        error,
    } = useAuth();

    const { leads } = useSelector(
        (state: RootState) => state.auth
    );

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "LEAD",
        teamName: "",
        leadId: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    useEffect(() => {
        if (mode === "signup" && formData.role === "MEMBER") {
            fetchLeads();
        }
    }, [mode, formData.role, fetchLeads]);
    

    const handleChange = (
        field: keyof FormData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const validate = () => {
        try {
            if (mode === "signup") {
                registerSchema.parse(formData);
            } else {
                loginSchema.parse({
                    email: formData.email,
                    password: formData.password,
                });
            }

            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors: Record<string, string> = {};

                error.issues.forEach((issue) => {
                    const field = issue.path[0];

                    if (
                        typeof field === "string" &&
                        !formattedErrors[field]
                    ) {
                        formattedErrors[field] = issue.message;
                    }
                });

                setErrors(formattedErrors);
            }

            return false;
        }
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            if (mode === "signup") {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    role: formData.role,
                    ...(formData.role === "LEAD"
                        ? {
                            teamName: formData.teamName,
                        }
                        : {
                            leadId: formData.leadId,
                        }),
                };

                await register(payload);

                navigate("/dashboard");
            } else {
                await login({
                    email: formData.email,
                    password: formData.password,
                });

                navigate("/dashboard");
            }
        } catch {
            
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">
                    {mode === "login"
                        ? "Welcome Back"
                        : "Create Your Account"}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    {mode === "login"
                        ? "Login to continue to Taskify"
                        : "Create your Taskify account"}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {mode === "signup" && (
                    <>
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(event) =>
                                    handleChange(
                                        "name",
                                        event.target.value
                                    )
                                }
                                className={`w-full rounded-lg border px-4 py-2 outline-none ${errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <select
                                value={formData.role}
                                onChange={(event) =>
                                    handleChange(
                                        "role",
                                        event.target.value
                                    )
                                }
                                className={`w-full rounded-lg border px-4 py-2 outline-none ${errors.role
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            >
                                <option value="LEAD">
                                    Lead
                                </option>

                                <option value="MEMBER">
                                    Member
                                </option>
                            </select>

                            {errors.role && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {formData.role === "LEAD" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    value={formData.teamName}
                                    onChange={(event) =>
                                        handleChange(
                                            "teamName",
                                            event.target.value
                                        )
                                    }
                                    className={`w-full rounded-lg border px-4 py-2 outline-none ${errors.teamName
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                />

                                {errors.teamName && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.teamName}
                                    </p>
                                )}
                            </div>
                        )}

                        {formData.role === "MEMBER" && (
                            <div>
                                <select
                                    value={formData.leadId}
                                    onChange={(event) =>
                                        handleChange(
                                            "leadId",
                                            event.target.value
                                        )
                                    }
                                    className={`w-full rounded-lg border px-4 py-2 outline-none ${errors.leadId
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <option value="">
                                        Select Team Lead
                                    </option>

                                    {leads.map((lead) => (
                                        <option
                                            key={lead.id}
                                            value={lead.id}
                                        >
                                            {lead.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.leadId && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.leadId}
                                    </p>
                                )}

                                {leads.length === 0 && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        No leads available.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(event) =>
                            handleChange(
                                "email",
                                event.target.value
                            )
                        }
                        className={`w-full rounded-lg border px-4 py-2 outline-none ${errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <div className="relative">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={formData.password}
                            onChange={(event) =>
                                handleChange(
                                    "password",
                                    event.target.value
                                )
                            }
                            className={`w-full rounded-lg border px-4 py-2 pr-11 outline-none ${errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (previous) => !previous
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                {mode === "signup" && (
                    <div>
                        <div className="relative">
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm Password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "confirmPassword",
                                        event.target.value
                                    )
                                }
                                className={`w-full rounded-lg border px-4 py-2 pr-11 outline-none ${errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                )}

                {error && (
                    <p className="text-center text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Processing..."
                        : mode === "login"
                            ? "Login"
                            : "Register"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                {mode === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </button>
                    </>
                )}
            </p>
        </div>
    );
};

export default AuthForm;