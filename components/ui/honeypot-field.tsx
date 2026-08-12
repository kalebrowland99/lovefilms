export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="companyWebsite">Company Website</label>
      <input
        type="text"
        id="companyWebsite"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
