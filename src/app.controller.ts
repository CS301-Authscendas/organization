import { Controller, Get } from "@nestjs/common";

@Controller("organization")
export class AppController {
    @Get("/heathcheck")
    healthcheck() {
        return "Organization service is working!";
    }
}
