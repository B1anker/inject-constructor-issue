export type ControllerRequest = Request & {
  cookies: {
    [k: string]: string
  }
}