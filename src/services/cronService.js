const cron = require("node-cron");
const VoucherRepository = require("../repositories/VoucherRepository");

class CronService {
  constructor() {
    this.voucherRepo = new VoucherRepository();
  }

  initScheduledJobs() {
    // Run daily at midnight
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("Running voucher expiration check...");
        await this.voucherRepo.expireOldVouchers();
      } catch (error) {
        console.error("Error in voucher expiration cron job:", error);
      }
    });
  }
}

module.exports = CronService;
