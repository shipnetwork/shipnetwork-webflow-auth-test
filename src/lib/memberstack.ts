// Use dynamic import to prevent SSR issues with localStorage
let memberstackInstance: any = null

export async function getMemberstack() {
  if (typeof window === "undefined") {
    throw new Error("Memberstack can only be used on the client side")
  }

  if (!memberstackInstance) {
    const memberstackDOM = (await import("@memberstack/dom")).default
    memberstackInstance = memberstackDOM.init({
      publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY!,
    })
  }

  return memberstackInstance
}
