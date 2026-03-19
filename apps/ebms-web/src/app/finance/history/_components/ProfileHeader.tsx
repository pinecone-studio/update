"use client";

type ProfileHeaderProps = {
  error: string | null;
};

export function ProfileHeader({ error }: ProfileHeaderProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-black">
        My Profile
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage your account information and settings
      </p>
      {error && (
        <p className="mt-2 text-sm text-red-400">Error: {error}</p>
      )}
    </>
  );
}
