# Home Automation Projects

## Summary

Currently this is a repo to support the services that make my life easier.

### Key Features
- **Budget**: I learned recently that Siri Shortcuts can be used to make api calls. After spending some time, I created shortcuts that would allow me
to manage my budget using siri. Previously my wife and I would use a google spreadsheet which would require us to open the sheet and manually update it.
Now with Siri Shortcuts we can perform distinct actions and provide input directly to siri which is then used to call the budget service.

### Project Details
- **Infrastructure**: 
    - This api is hosted at my domain (dm for usage if you're interested)
    - I used a `route53` hosted zone to map incoming request at that subdomain directly to an `api gateway` which has permissions to invoke the `lambda` that operates
    this service. 
    - Because this `api gateway` has one stage `default` requests are appended with `default` in the path and that's why I must append `default` all incoming requests.
    - I updated the esbuild config to include the `prisma` client as part of the build in order for the lambda to have the client at runtime.
    - The database is hosted by `neon.tech` because they allow for [automatic connection pooling](https://neon.tech/blog/survive-thousands-connections). Not that I expect to get that kind of traffic, I was just curious at how connection pooling is managed for lambdas and Neon has a great free tier.
- **notes**:
    - Siri Shortcuts do not allow for a body to be included in GET requests so I wasn't able to set up a true REST api because I'm reading the `userId` from the body
    on many requests and it would be a breaking change for my current users to switch to reading that from a header instead.

### Future features:
- **Considering**
    - I attempted to set up a texting service but the barrier of entry is so high for a hobbyist nowadays. You have to create a `campaign` and then submit an application for review by the carriers after paying for a A2P 10DLC number (application to phone). If your application is denied, you pay 15 dollars for each submission and it can take 2-6 weeks per submission. Not worth it in my opinion. 
    - Email notifications for budgeting
    - Front end for anonymous user sign up
        - Currently my users are friends and family which is keeping my budget service within the free tier of AWS/Neon. I'm considering allowing anonymous users to sign up but I need to figure out how to keep costs as low as possible. 