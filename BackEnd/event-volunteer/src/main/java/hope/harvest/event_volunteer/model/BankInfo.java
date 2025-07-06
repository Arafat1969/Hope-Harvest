package hope.harvest.event_volunteer.model;

import java.io.Serializable;

public class BankInfo implements Serializable {
    private String accountNumber;
    private String accountType;
    private String accountBranch;

    public BankInfo() {}

    public BankInfo(String accountNumber, String accountType, String accountBranch) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.accountBranch = accountBranch;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getAccountBranch() {
        return accountBranch;
    }

    public void setAccountBranch(String accountBranch) {
        this.accountBranch = accountBranch;
    }

    @Override
    public String toString() {
        return "{" +
                "\"accountNumber\":\"" + accountNumber + "\"," +
                "\"accountType\":\"" + accountType + "\"," +
                "\"accountBranch\":\"" + accountBranch + "\"" +
                '}';
    }
}
