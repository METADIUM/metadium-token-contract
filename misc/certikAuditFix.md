# Metadium CERTIC Audit Report FIX


1. About suggestion a, For Metadium.burn() method, it’s better to have require(_value <= totalSupply_) explicitly
rather than relying on the transitive relationship between _value <= balances[msg.sender]
<= totalSupply_;

    
    This suggestion is fixed at commit [4d00361](https://bitbucket.org/coinplugin/metadiumtokenwithoutcrowdsale/commits/4d00361c517ed57e05a26f0b2d3c4baafaea4b1f)



2. About suggestion e, This transferable feature is intended.