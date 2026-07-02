export type GoogleAuthResult = {
  idToken: string
}

export type GoogleAuthService = {
  signIn(): Promise<GoogleAuthResult>
}

export const googleAuthService: GoogleAuthService = {
  async signIn() {
    throw new Error('Google sign in is not available yet')
  },
}
