import { Controller, Get } from "@nestjs/common";

@Controller("")
export class AppController {
    @Get("/heathcheck")
    healthcheck() {
        return "Organization service is working!";
    }
}
