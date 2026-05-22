export default function formatCurrency(amount: string | null) {
    if (!amount) return "$0.00";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount));
}